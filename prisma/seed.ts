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
  ["academy_programs.read", "Academy Programs Read", "Read academy programs"],
  ["academy_programs.create", "Academy Programs Create", "Create academy programs"],
  ["academy_programs.update", "Academy Programs Update", "Update academy programs"],
  ["academy_programs.delete", "Academy Programs Delete", "Delete academy programs"],
  ["academy_events.read", "Academy Events Read", "Read academy events"],
  ["academy_events.create", "Academy Events Create", "Create academy events"],
  ["academy_events.update", "Academy Events Update", "Update academy events"],
  ["academy_events.delete", "Academy Events Delete", "Delete academy events"],
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
  ["leads.read", "Leads Read", "Read leads"],
  ["leads.update", "Leads Update", "Update leads"],
  ["leads.assign", "Leads Assign", "Assign leads"],
  ["leads.note", "Leads Note", "Add lead notes"],
  ["leads.export", "Leads Export", "Export leads"],
  ["media.read", "Media Read", "Read media assets"],
  ["media.create", "Media Create", "Create media assets"],
  ["media.update", "Media Update", "Update media assets"],
  ["media.delete", "Media Delete", "Delete media assets"],
  ["notifications.read", "Notifications Read", "Read notification settings"],
  ["notifications.update", "Notifications Update", "Update notification settings"],
  ["audit_logs.read", "Audit Logs Read", "Read audit logs"],
  ["dashboard.read", "Dashboard Read", "Read dashboard summary"],
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
       "academy_programs.read",
       "academy_programs.create",
       "academy_programs.update",
       "academy_events.read",
       "academy_events.create",
       "academy_events.update",
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
      "leads.read",
      "leads.update",
      "leads.assign",
      "leads.note",
      "leads.export",
      "media.read",
      "media.create",
      "media.update",
      "dashboard.read",
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
       "academy_programs.read",
       "academy_events.read",
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
      "dashboard.read",
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
       "academy_programs.read",
       "academy_events.read",
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
      "media.read",
      "dashboard.read",
      "notifications.read",
      "notifications.update",
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
      "dashboard.read",
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
      "leads.read",
      "leads.update",
      "leads.assign",
      "leads.note",
      "media.read",
      "media.create",
      "media.update",
      "media.delete",
      "dashboard.read",
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
       "academy_programs.read",
       "academy_events.read",
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
      "leads.read",
      "audit_logs.read",
      "dashboard.read",
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

const notificationSettingDefinitions = [
  {
    channel: "email",
    event: "lead.created",
    isEnabled: false,
    config: {
      recipients: [],
    },
  },
  {
    channel: "webhook",
    event: "lead.created",
    isEnabled: false,
    config: {
      url: "",
      secret: "",
    },
  },
] as const;

const academyProgramDefinitions = [
  {
    slug: "pelatihan-sertifikasi",
    title: "Pelatihan & Sertifikasi",
    shortTitle: "Pelatihan & Sertifikasi",
    priceFrom: 3500000,
    duration: "4 Hari",
    format: "Kelas intensif",
    audience: "Individu dan tim yang ingin meningkatkan skill digital",
    image: "/assets/img/courses/18.jpg",
    description: "Program singkat dengan materi terarah dan satu hari sertifikasi.",
    overview: "Jalur belajar intensif untuk peserta yang ingin memahami skill digital secara praktis, kemudian membuktikan kompetensinya melalui proses sertifikasi.",
    highlights: ["3 hari materi praktik", "1 hari sertifikasi", "Pendampingan mentor", "Cocok untuk individu dan kebutuhan tim"],
    tracks: [
      {
        slug: "junior-web-developer",
        title: "Junior Web Developer",
        icon: "fa-code",
        price: 3500000,
        description: "Skema intensif untuk membangun fondasi pengembangan web.",
        syllabusModules: [
          {
            code: "J.620100.004.02",
            title: "Menggunakan Struktur Data",
            description: "Unit ini mencakup kompetensi, pengetahuan, dan sikap kerja yang diperlukan untuk mempelajari dan membuat struktur data yang diterapkan pada pemrograman.",
            competencies: [
              { element: "Mengidentifikasi konsep data dan struktur data", criteria: ["Konsep data dan struktur data diidentifikasi sesuai dengan konteks permasalahan.", "Alternatif struktur data dibandingkan kelebihan dan kekurangannya untuk konteks permasalahan yang diselesaikan."] },
              { element: "Menerapkan struktur data dan akses terhadap struktur data tersebut", criteria: ["Struktur data diimplementasikan sesuai dengan bahasa pemrograman yang akan dipergunakan.", "Akses terhadap data dinyatakan dalam algoritma yang efisiensi sesuai bahasa pemrograman yang akan dipakai."] },
            ],
          },
          {
            code: "J.620100.005.01",
            title: "Mengimplementasikan User Interface",
            description: "Unit ini mencakup kompetensi, pengetahuan, dan sikap kerja yang diperlukan dalam membuat rancangan antar muka program.",
            competencies: [
              { element: "Mengidentifikasi rancangan user interface", criteria: ["Rancangan user interface diidentifikasi sesuai kebutuhan.", "Komponen user interface dialog diidentifikasi sesuai konteks rancangan proses.", "Urutan dari akses komponen user interface dialog dijelaskan.", "Simulasi (mock-up) dari aplikasi yang akan dikembangkan dibuat."] },
              { element: "Melakukan implementasi rancangan user interface", criteria: ["Menu program sesuai dengan rancangan program ditentukan.", "Penempatan user interface dialog diatur secara sekuensial.", "Setting aktif-pasif komponen user interface dialog disesuaikan dengan urutan alur proses.", "Bentuk style dari komponen user interface ditentukan.", "Penerapan simulasi dijadikan suatu proses yang sesungguhnya."] },
            ],
          },
        ],
        classPlan: [
          { day: "Hari 1", title: "Dasar pemrograman", activities: ["Penjelasan pelatihan dan sertifikasi", "Instalasi software tools pemrograman", "Menggunakan struktur data", "Mengimplementasikan pemrograman terstruktur"] },
          { day: "Hari 2", title: "Antarmuka dan komponen", activities: ["Mengimplementasikan User Interface", "Praktik dan review implementasi User Interface", "Menggunakan library atau komponen pre-existing"] },
          { day: "Hari 3", title: "Kualitas kode dan persiapan asesmen", activities: ["Menulis kode sesuai guidelines dan best practices", "Membuat dokumen kode program", "Melakukan debugging", "Pra-asesmen dan persiapan portofolio"] },
        ],
        syllabusStatus: "Modul pembelajaran tersedia berdasarkan TOR pelatihan.",
        scheduleStatus: "Pelatihan dilaksanakan selama 3 hari, Jumat sampai Minggu pukul 08.00-16.00. Jadwal asesmen sertifikasi mengikuti konfirmasi LSP.",
      },
      {
        slug: "digital-marketing",
        title: "Digital Marketing",
        icon: "fa-bullhorn",
        price: 4500000,
        description: "Skema intensif untuk mengembangkan kemampuan pemasaran digital praktis.",
        syllabusModules: [{ title: "Materi 1", description: "Rincian materi akan tersedia melalui CMS." }],
        syllabusStatus: "Modul pembelajaran akan tersedia melalui CMS.",
        scheduleStatus: "Jadwal kelas akan diumumkan setelah pendaftaran dikonfirmasi.",
      },
    ],
    seoTitle: "Pelatihan & Sertifikasi Morrus",
    seoDescription: "Program pelatihan singkat Morrus dengan materi praktik dan sertifikasi.",
    seoKeywords: ["pelatihan", "sertifikasi", "bootcamp morrus"],
    featured: true,
    sortOrder: 0,
    isPublished: true,
  },
  {
    slug: "bootcamp-online",
    title: "Bootcamp Online",
    shortTitle: "Bootcamp Online",
    priceFrom: 6500000,
    duration: "4 Bulan",
    format: "Bootcamp online",
    audience: "Calon talenta digital yang ingin membangun kesiapan kerja",
    image: "/assets/img/courses/19.jpg",
    description: "Bootcamp terstruktur dengan pembelajaran intensif dan persiapan kerja berbasis proyek.",
    overview: "Jalur belajar online yang lebih mendalam untuk membangun fondasi skill digital, kebiasaan kerja proyek, dan kesiapan memasuki peluang karier.",
    highlights: ["3 bulan pembelajaran intensif", "1 bulan persiapan kerja", "Latihan berbasis proyek", "Belajar online bersama mentor"],
    tracks: [
      {
        slug: "software-engineer",
        title: "Software Engineer",
        icon: "fa-laptop-code",
        price: 6500000,
        description: "Bootcamp online untuk membangun kesiapan sebagai software engineer.",
        syllabusModules: [{ title: "Materi 1", description: "Rincian materi akan tersedia melalui CMS." }],
        syllabusStatus: "Modul pembelajaran akan tersedia melalui CMS.",
        scheduleStatus: "Jadwal per bulan akan diumumkan setelah pendaftaran dikonfirmasi.",
      },
    ],
    seoTitle: "Bootcamp Online Morrus",
    seoDescription: "Bootcamp online Morrus untuk membangun skill digital dan kesiapan kerja.",
    seoKeywords: ["bootcamp online", "software engineer", "morrus academy"],
    featured: true,
    sortOrder: 1,
    isPublished: true,
  },
] as const;

const academyEventDefinitions = [
  {
    slug: "ai-productivity-for-business-2026",
    title: "AI Productivity for Business",
    category: "Event Digital",
    summary: "Event online untuk mempraktikkan AI pada pekerjaan, marketing, dan operasional bisnis sehari-hari.",
    startDate: new Date("2026-09-18T18:30:00+07:00"),
    endDate: new Date("2026-09-20T21:30:00+07:00"),
    dateLabel: "18-20 September 2026",
    timeLabel: "18.30-21.30 WIB",
    location: "Zoom Live",
    price: 0,
    priceLabel: "Gratis",
    seatLabel: "50 kursi tersedia",
    image: "/assets/img/event/details-1.jpg",
    learnings: [
      "Dasar penggunaan AI untuk produktivitas kerja.",
      "Menyusun prompt yang jelas dan terarah.",
      "Otomasi tugas bisnis yang berulang.",
      "Mengolah ide, dokumen, dan komunikasi dengan bantuan AI.",
    ],
    seoTitle: "AI Productivity for Business 2026",
    seoDescription: "Workshop online Morrus tentang pemanfaatan AI untuk produktivitas bisnis.",
    seoKeywords: ["AI workshop", "produktivity", "business AI"],
    featured: true,
    sortOrder: 0,
    isPublished: true,
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

async function seedNotificationSettings() {
  for (const definition of notificationSettingDefinitions) {
    await prisma.notificationSetting.upsert({
      where: {
        channel_event: {
          channel: definition.channel,
          event: definition.event,
        },
      },
      update: {
        channel: definition.channel,
        event: definition.event,
        isEnabled: definition.isEnabled,
        config: definition.config as any,
      },
      create: {
        channel: definition.channel,
        event: definition.event,
        isEnabled: definition.isEnabled,
        config: definition.config as any,
      },
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

async function seedAcademyPrograms() {
  for (const definition of academyProgramDefinitions) {
    await prisma.academyProgram.upsert({
      where: { slug: definition.slug },
      update: {
        title: definition.title,
        shortTitle: definition.shortTitle,
        priceFrom: definition.priceFrom,
        duration: definition.duration,
        format: definition.format,
        audience: definition.audience,
        image: definition.image,
        description: definition.description,
        overview: definition.overview,
        highlights: definition.highlights as any,
        tracks: definition.tracks as any,
        seoTitle: definition.seoTitle,
        seoDescription: definition.seoDescription,
        seoKeywords: definition.seoKeywords as any,
        featured: definition.featured,
        sortOrder: definition.sortOrder,
        isPublished: definition.isPublished,
      },
      create: {
        slug: definition.slug,
        title: definition.title,
        shortTitle: definition.shortTitle,
        priceFrom: definition.priceFrom,
        duration: definition.duration,
        format: definition.format,
        audience: definition.audience,
        image: definition.image,
        description: definition.description,
        overview: definition.overview,
        highlights: definition.highlights as any,
        tracks: definition.tracks as any,
        seoTitle: definition.seoTitle,
        seoDescription: definition.seoDescription,
        seoKeywords: definition.seoKeywords as any,
        featured: definition.featured,
        sortOrder: definition.sortOrder,
        isPublished: definition.isPublished,
      },
    });
  }
}

async function seedAcademyEvents() {
  for (const definition of academyEventDefinitions) {
    await prisma.academyEvent.upsert({
      where: { slug: definition.slug },
      update: {
        title: definition.title,
        category: definition.category,
        summary: definition.summary,
        startDate: definition.startDate,
        endDate: definition.endDate,
        dateLabel: definition.dateLabel,
        timeLabel: definition.timeLabel,
        location: definition.location,
        price: definition.price,
        priceLabel: definition.priceLabel,
        seatLabel: definition.seatLabel,
        image: definition.image,
        learnings: definition.learnings as any,
        seoTitle: definition.seoTitle,
        seoDescription: definition.seoDescription,
        seoKeywords: definition.seoKeywords as any,
        featured: definition.featured,
        sortOrder: definition.sortOrder,
        isPublished: definition.isPublished,
      },
      create: {
        slug: definition.slug,
        title: definition.title,
        category: definition.category,
        summary: definition.summary,
        startDate: definition.startDate,
        endDate: definition.endDate,
        dateLabel: definition.dateLabel,
        timeLabel: definition.timeLabel,
        location: definition.location,
        price: definition.price,
        priceLabel: definition.priceLabel,
        seatLabel: definition.seatLabel,
        image: definition.image,
        learnings: definition.learnings as any,
        seoTitle: definition.seoTitle,
        seoDescription: definition.seoDescription,
        seoKeywords: definition.seoKeywords as any,
        featured: definition.featured,
        sortOrder: definition.sortOrder,
        isPublished: definition.isPublished,
      },
    });
  }
}

async function main() {
  await seedPermissions();
  await seedRoles();
  await seedNavigationMenus();
  await seedSiteSettings();
  await seedNotificationSettings();
  await seedAcademyPrograms();
  await seedAcademyEvents();
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
