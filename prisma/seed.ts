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
  ["pages.read", "Pages Read", "Read pages"],
  ["pages.create", "Pages Create", "Create pages"],
  ["pages.update", "Pages Update", "Update pages"],
  ["pages.delete", "Pages Delete", "Delete pages"],
  ["pages.publish", "Pages Publish", "Publish pages"],
  ["services.read", "Services Read", "Read services"],
  ["services.create", "Services Create", "Create services"],
  ["services.update", "Services Update", "Update services"],
  ["services.delete", "Services Delete", "Delete services"],
  ["navigation.read", "Navigation Read", "Read navigation menus and items"],
  ["navigation.update", "Navigation Update", "Update navigation menus and items"],
  ["settings.read", "Settings Read", "Read site settings"],
  ["settings.update", "Settings Update", "Update site settings"],
  ["blog_posts.read", "Blog Posts Read", "Read blog posts"],
  ["blog_posts.create", "Blog Posts Create", "Create blog posts"],
  ["blog_posts.update", "Blog Posts Update", "Update blog posts"],
  ["blog_posts.delete", "Blog Posts Delete", "Delete blog posts"],
  ["blog_posts.submit_review", "Blog Posts Submit Review", "Submit blog posts for review"],
  ["blog_posts.approve", "Blog Posts Approve", "Approve blog posts"],
  ["blog_posts.publish", "Blog Posts Publish", "Publish and schedule blog posts"],
  ["blog_posts.archive", "Blog Posts Archive", "Archive blog posts"],
  ["blog_categories.read", "Blog Categories Read", "Read blog categories"],
  ["blog_categories.create", "Blog Categories Create", "Create blog categories"],
  ["blog_categories.update", "Blog Categories Update", "Update blog categories"],
  ["blog_categories.delete", "Blog Categories Delete", "Delete blog categories"],
  ["tags.read", "Tags Read", "Read tags"],
  ["tags.create", "Tags Create", "Create tags"],
  ["tags.update", "Tags Update", "Update tags"],
  ["tags.delete", "Tags Delete", "Delete tags"],
  ["case_studies.read", "Case Studies Read", "Read case studies"],
  ["case_studies.create", "Case Studies Create", "Create case studies"],
  ["case_studies.update", "Case Studies Update", "Update case studies"],
  ["case_studies.delete", "Case Studies Delete", "Delete case studies"],
  ["case_studies.submit_review", "Case Studies Submit Review", "Submit case studies for review"],
  ["case_studies.approve", "Case Studies Approve", "Approve case studies"],
  ["case_studies.publish", "Case Studies Publish", "Publish and schedule case studies"],
  ["case_studies.archive", "Case Studies Archive", "Archive case studies"],
  ["testimonials.read", "Testimonials Read", "Read testimonials"],
  ["testimonials.create", "Testimonials Create", "Create testimonials"],
  ["testimonials.update", "Testimonials Update", "Update testimonials"],
  ["testimonials.delete", "Testimonials Delete", "Delete testimonials"],
  ["testimonials.submit_review", "Testimonials Submit Review", "Submit testimonials for review"],
  ["testimonials.approve", "Testimonials Approve", "Approve testimonials"],
  ["testimonials.publish", "Testimonials Publish", "Publish and schedule testimonials"],
  ["testimonials.archive", "Testimonials Archive", "Archive testimonials"],
  ["team.read", "Team Read", "Read team members"],
  ["team.create", "Team Create", "Create team members"],
  ["team.update", "Team Update", "Update team members"],
  ["team.delete", "Team Delete", "Delete team members"],
  ["team.submit_review", "Team Submit Review", "Submit team members for review"],
  ["team.approve", "Team Approve", "Approve team members"],
  ["team.publish", "Team Publish", "Publish and schedule team members"],
  ["team.archive", "Team Archive", "Archive team members"],
  ["faq.read", "Faq Read", "Read faq categories and items"],
  ["faq.create", "Faq Create", "Create faq categories and items"],
  ["faq.update", "Faq Update", "Update faq categories and items"],
  ["faq.delete", "Faq Delete", "Delete faq categories and items"],
  ["faq.submit_review", "Faq Submit Review", "Submit faq items for review"],
  ["faq.approve", "Faq Approve", "Approve faq items"],
  ["faq.publish", "Faq Publish", "Publish and schedule faq items"],
  ["faq.archive", "Faq Archive", "Archive faq items"],
  ["redirects.read", "Redirects Read", "Read redirect rules"],
  ["redirects.create", "Redirects Create", "Create redirect rules"],
  ["redirects.update", "Redirects Update", "Update redirect rules"],
  ["redirects.delete", "Redirects Delete", "Delete redirect rules"],
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
      "pages.read",
      "pages.create",
      "pages.update",
      "pages.publish",
      "services.read",
      "services.create",
      "services.update",
      "navigation.read",
      "settings.read",
      "blog_posts.read",
      "blog_posts.create",
      "blog_posts.update",
      "blog_posts.submit_review",
      "blog_categories.read",
      "blog_categories.create",
      "blog_categories.update",
      "tags.read",
      "tags.create",
      "tags.update",
      "case_studies.read",
      "case_studies.create",
      "case_studies.update",
      "case_studies.submit_review",
      "testimonials.read",
      "testimonials.create",
      "testimonials.update",
      "testimonials.submit_review",
      "team.read",
      "team.create",
      "team.update",
      "team.submit_review",
      "faq.read",
      "faq.create",
      "faq.update",
      "faq.submit_review",
      "redirects.read",
      "redirects.create",
      "redirects.update",
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
      "pages.read",
      "pages.update",
      "pages.publish",
      "services.read",
      "navigation.read",
      "settings.read",
      "blog_posts.read",
      "blog_posts.update",
      "blog_posts.approve",
      "blog_posts.publish",
      "blog_posts.archive",
      "blog_categories.read",
      "tags.read",
      "case_studies.read",
      "case_studies.update",
      "case_studies.approve",
      "case_studies.publish",
      "case_studies.archive",
      "testimonials.read",
      "testimonials.update",
      "testimonials.approve",
      "testimonials.publish",
      "testimonials.archive",
      "team.read",
      "team.update",
      "team.approve",
      "team.publish",
      "team.archive",
      "faq.read",
      "faq.update",
      "faq.approve",
      "faq.publish",
      "faq.archive",
      "redirects.read",
    ],
  },
  seo_marketing: {
    name: "SEO Marketing",
    description: "Review content metadata and public visibility inputs.",
    permissions: [
      "auth.me",
      "auth.logout",
      "projects.read",
      "pages.read",
      "services.read",
      "navigation.read",
      "settings.read",
      "blog_posts.read",
      "blog_posts.create",
      "blog_posts.update",
      "blog_posts.submit_review",
      "blog_categories.read",
      "blog_categories.create",
      "blog_categories.update",
      "tags.read",
      "tags.create",
      "tags.update",
      "case_studies.read",
      "case_studies.create",
      "case_studies.update",
      "case_studies.submit_review",
      "testimonials.read",
      "testimonials.create",
      "testimonials.update",
      "testimonials.submit_review",
      "team.read",
      "faq.read",
      "faq.create",
      "faq.update",
      "faq.submit_review",
      "redirects.read",
      "redirects.create",
      "redirects.update",
      "redirects.delete",
    ],
  },
  sales_bd: {
    name: "Sales BD",
    description: "View public content data relevant for sales and business development.",
    permissions: [
      "auth.me",
      "auth.logout",
      "projects.read",
      "pages.read",
      "services.read",
      "navigation.read",
      "settings.read",
      "blog_posts.read",
      "blog_categories.read",
      "tags.read",
      "case_studies.read",
      "testimonials.read",
      "team.read",
      "faq.read",
      "redirects.read",
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
      "pages.read",
      "services.read",
      "services.update",
      "navigation.read",
      "settings.read",
      "blog_posts.read",
      "case_studies.read",
      "testimonials.read",
      "testimonials.create",
      "testimonials.update",
      "team.read",
      "team.create",
      "team.update",
      "faq.read",
      "redirects.read",
    ],
  },
  viewer_analyst: {
    name: "Viewer Analyst",
    description: "Read-only access for review and analysis.",
    permissions: [
      "auth.me",
      "auth.logout",
      "projects.read",
      "pages.read",
      "services.read",
      "users.read",
      "roles.read",
      "permissions.read",
      "navigation.read",
      "settings.read",
      "blog_posts.read",
      "blog_categories.read",
      "tags.read",
      "case_studies.read",
      "testimonials.read",
      "team.read",
      "faq.read",
      "redirects.read",
    ],
  },
} as const;

const navigationMenuDefinitions = [
  {
    code: "header",
    name: "Header Menu",
    description: "Primary navigation shown in the site header.",
  },
  {
    code: "footer",
    name: "Footer Menu",
    description: "Navigation links shown in the site footer.",
  },
  {
    code: "quick_links",
    name: "Quick Links",
    description: "Supplementary navigation links for shortcuts.",
  },
  {
    code: "social",
    name: "Social Links",
    description: "Social profile links shown on the website.",
  },
] as const;

const siteSettingDefinitions = [
  {
    group: "company_profile",
    key: "brand_name",
    label: "Brand Name",
    value: "Morrus Digital Connecting",
    valueType: "string",
  },
  {
    group: "company_profile",
    key: "tagline",
    label: "Tagline",
    value: "Digital solutions for business growth.",
    valueType: "string",
  },
  {
    group: "contact",
    key: "email",
    label: "Public Contact Email",
    value: "hello@morrusdigitalconnecting.com",
    valueType: "string",
  },
  {
    group: "contact",
    key: "phone",
    label: "Public Contact Phone",
    value: "+62 000 0000 0000",
    valueType: "string",
  },
] as const;

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

async function seedNavigationMenus() {
  for (const definition of navigationMenuDefinitions) {
    await prisma.navigationMenu.upsert({
      where: { code: definition.code },
      update: {
        name: definition.name,
        description: definition.description,
      },
      create: definition,
    });
  }
}

async function seedSiteSettings() {
  for (const definition of siteSettingDefinitions) {
    await prisma.siteSetting.upsert({
      where: {
        group_key: {
          group: definition.group,
          key: definition.key,
        },
      },
      update: {
        label: definition.label,
        value: definition.value as any,
        valueType: definition.valueType,
      },
      create: {
        group: definition.group,
        key: definition.key,
        label: definition.label,
        value: definition.value as any,
        valueType: definition.valueType,
      },
    });
  }
}

async function main() {
  await seedPermissions();
  await seedRoles();
  await seedNavigationMenus();
  await seedSiteSettings();
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
