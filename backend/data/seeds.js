const initialLeads = [
  {
    name: "Sarah Jenkins",
    email: "sarah.jenkins@acmesolutions.io",
    phone: "+1 (555) 234-5678",
    company: "Acme Solutions",
    source: "Website Contact Form",
    status: "new",
    message: "Interested in enterprise pricing for our 50-person sales team. Looking to deploy by next quarter.",
    followUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    notes: [
      {
        id: "note-1",
        content: "Submitted inquiry via main landing page contact form.",
        author: "System (Website Form)",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    name: "David Chen",
    email: "d.chen@apexlogistics.com",
    phone: "+1 (555) 987-6543",
    company: "Apex Logistics",
    source: "Website Contact Form",
    status: "contacted",
    message: "Need automated lead tracking and notes synchronization for our fleet managers.",
    followUpDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    notes: [
      {
        id: "note-2",
        content: "Form inquiry received: requested fleet manager workflow demo.",
        author: "System (Website Form)",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: "note-3",
        content: "Completed intro discovery call. David requested a custom proposal with API integration details.",
        author: "Admin",
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    name: "Elena Rostova",
    email: "elena@novatech.dev",
    phone: "+1 (555) 432-1098",
    company: "NovaTech Innovations",
    source: "Referral",
    status: "converted",
    message: "Referred by Mark from CloudPeak. We signed the annual agreement.",
    followUpDate: "",
    notes: [
      {
        id: "note-4",
        content: "Lead received via partner referral.",
        author: "Admin",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        id: "note-5",
        content: "Demo presented on Friday. Approved by VP of Engineering.",
        author: "Admin",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: "note-6",
        content: "Contract signed! Converted to annual client account.",
        author: "Admin",
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    name: "Marcus Brody",
    email: "mbrody@zenithretail.com",
    phone: "+1 (555) 345-6789",
    company: "Zenith Retail Group",
    source: "LinkedIn",
    status: "contacted",
    message: "Saw your post on omnichannel lead management. Would love to see a live demo.",
    followUpDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    notes: [
      {
        id: "note-7",
        content: "Sent initial scheduling link for Zoom demo.",
        author: "Admin",
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    name: "Olivia Patel",
    email: "olivia.p@horizonhealth.org",
    phone: "+1 (555) 765-4321",
    company: "Horizon Health",
    source: "Website Contact Form",
    status: "new",
    message: "Looking for HIPAA-compliant client lead intake forms.",
    followUpDate: new Date(Date.now() + 86400000 * 1).toISOString().split("T")[0],
    notes: [
      {
        id: "note-8",
        content: "Inquiry submitted through website support/contact page.",
        author: "System (Website Form)",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

module.exports = { initialLeads };
