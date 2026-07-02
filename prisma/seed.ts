import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/config/prisma";

const permissionDefinitions = [
  ["auth.login", "Auth Login", "Authentication login access"],
  ["auth.refresh", "Auth Refresh", "Authentication refresh access"],
  ["auth.logout", "Auth Logout", "Authentication logout access"],
  ["auth.me", "Auth Me", "Read current admin profile"],
  ["users.read", "Users Read", "Read admin users"],
  ["users.create", "Users Create", "Create admin users"],
  ["users.update", "Users Update", "Update admin users"],
  ["users.activate", "Users Activate", "Activate admin users"],
  ["users.deactivate", "Users Deactivate", "Deactivate admin users"],
  ["users.assign_role", "Users Assign Role", "Assign roles to users"],
  ["roles.read", "Roles Read", "Read roles"],
  ["roles.create", "Roles Create", "Create roles"],
  ["roles.update", "Roles Update", "Update roles"],
  ["roles.delete", "Roles Delete", "Delete roles"],
  ["roles.assign_permission", "Roles Assign Permission", "Assign permissions to roles"],
  ["permissions.read", "Permissions Read", "Read permissions"],
  ["projects.read", "Projects Read", "Read projects"],
  ["projects.create", "Projects Create", "Create projects"],
  ["projects.update", "Projects Update", "Update projects"],
  ["projects.delete", "Projects Delete", "Delete projects"],
] as const;

const roleDefinitions = {
  super_admin: {
    name: "Super Admin",
    description: "Full access to all CMS admin features.",
    permissions: permissionDefinitions.map(([code]) => code),
  },
  content_manager: {
    name: "Content Manager",
    description: "Manage content creation and updates.",
    permissions: [
      "auth.me",
      "auth.logout",
      "projects.read",
      "projects.create",
      "projects.update",
    ],
  },
  reviewer_publisher: {
    name: "Reviewer Publisher",
    description: "Review and approve content updates.",
    permissions: [
      "auth.me",
      "auth.logout",
      "projects.read",
      "projects.update",
    ],
  },
  seo_marketing: {
    name: "SEO Marketing",
    description: "Review content metadata and public visibility inputs.",
    permissions: [
      "auth.me",
      "auth.logout",
      "projects.read",
    ],
  },
  sales_bd: {
    name: "Sales BD",
    description: "View public content data relevant for sales and business development.",
    permissions: [
      "auth.me",
      "auth.logout",
      "projects.read",
    ],
  },
  media_manager: {
    name: "Media Manager",
    description: "Review project/media-facing content entries.",
    permissions: [
      "auth.me",
      "auth.logout",
      "projects.read",
      "projects.update",
    ],
  },
  viewer_analyst: {
    name: "Viewer Analyst",
    description: "Read-only access for review and analysis.",
    permissions: [
      "auth.me",
      "auth.logout",
      "projects.read",
      "users.read",
      "roles.read",
      "permissions.read",
    ],
  },
} as const;

async function seedPermissions() {
  for (const [code, name, description] of permissionDefinitions) {
    const [module, action] = code.split(".");

    await prisma.permission.upsert({
      where: { code },
      update: {
        name,
        description,
        module,
        action,
      },
      create: {
        code,
        name,
        description,
        module,
        action,
      },
    });
  }
}

async function seedRoles() {
  const permissions = await prisma.permission.findMany();
  const permissionIdsByCode = new Map(
    permissions.map((permission) => [permission.code, permission.id])
  );

  for (const [code, definition] of Object.entries(roleDefinitions)) {
    const role = await prisma.role.upsert({
      where: { code },
      update: {
        name: definition.name,
        description: definition.description,
        isSystem: true,
      },
      create: {
        code,
        name: definition.name,
        description: definition.description,
        isSystem: true,
      },
    });

    const permissionIds = definition.permissions
      .map((permissionCode) => permissionIdsByCode.get(permissionCode))
      .filter((value): value is number => typeof value === "number");

    await prisma.rolePermission.deleteMany({
      where: { roleId: role.id },
    });

    if (permissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId: role.id,
          permissionId,
        })),
        skipDuplicates: true,
      });
    }
  }
}

async function seedBootstrapAdmin() {
  const fallbackEmail =
    process.env.NODE_ENV === "production" ? undefined : "admin@mdc.local";
  const fallbackPassword =
    process.env.NODE_ENV === "production" ? undefined : "ChangeMe123!";
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL || fallbackEmail;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD || fallbackPassword;

  if (!email || !password) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const superAdminRole = await prisma.role.findUnique({
    where: { code: "super_admin" },
  });

  if (!superAdminRole) {
    throw new Error("super_admin role must exist before creating bootstrap admin");
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: "Bootstrap Admin",
      passwordHash,
      isActive: true,
    },
    create: {
      email,
      name: "Bootstrap Admin",
      passwordHash,
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: superAdminRole.id,
    },
  });
}

async function main() {
  await seedPermissions();
  await seedRoles();
  await seedBootstrapAdmin();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
