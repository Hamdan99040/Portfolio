import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

// --- Production Mongoose Definitions ---

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  otpSecret: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  bio: { type: String, required: true },
  cvUrl: { type: String, default: '#' },
  avatarUrl: { type: String, default: '' },
  profiles: {
    github: String,
    linkedin: String,
    upwork: String,
    email: String
  }
});

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  problemSolved: { type: String, required: true },
  role: { type: String, required: true },
  github: { type: String, default: '' },
  demo: { type: String, default: '' },
  category: { type: String, required: true },
  technologies: [String],
  image: { type: String, default: '' }
});

const ExperienceSchema = new Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  period: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true }
});

const CertificationSchema = new Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  credentialUrl: { type: String, default: '#' },
  type: { type: String, required: true }
});

const DocumentSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  fileName: { type: String, required: true },
  watermarkText: { type: String, default: 'CONFIDENTIAL' },
  uploadedAt: { type: String, required: true },
  fileContent: { type: String, required: true } // Base64 encoding
});

const ContactMessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  sentAt: { type: String, required: true }
});

const SharedLinkSchema = new Schema({
  token: { type: String, required: true },
  documentId: { type: String, required: true },
  expiresAt: { type: String, required: true },
  watermarkText: { type: String, default: 'CONFIDENTIAL' }
});

// Avoid re-compiling models in Next.js HMR
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const Experience = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
const Certification = mongoose.models.Certification || mongoose.model('Certification', CertificationSchema);
const Document = mongoose.models.Document || mongoose.model('Document', DocumentSchema);
const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
const SharedLink = mongoose.models.SharedLink || mongoose.model('SharedLink', SharedLinkSchema);

// --- Dual Mode Database Adapter Configuration ---

const MONGODB_URI = process.env.MONGODB_URI;
let isConnected = false;

async function connectToMongo() {
  if (isConnected) return;
  if (!MONGODB_URI) throw new Error('MONGODB_URI not provided');
  await mongoose.connect(MONGODB_URI);
  isConnected = true;
}

// Local mock DB helper functions
const mockDbPath = path.join(process.cwd(), 'src/lib/mockDb.json');

function readMockDb() {
  try {
    const data = fs.readFileSync(mockDbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read mock DB file:', err);
    return {
      admin: {},
      projects: [],
      experiences: [],
      certifications: [],
      documents: [],
      messages: [],
      sharedLinks: []
    };
  }
}

function writeMockDb(data: any) {
  try {
    fs.writeFileSync(mockDbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write to mock DB file:', err);
  }
}

// --- CRUD Operations Wrapper ---

export const db = {
  // Admin details
  async getAdmin() {
    if (MONGODB_URI) {
      await connectToMongo();
      let admin = await Admin.findOne();
      if (!admin) {
        // Seed from mockDb.json
        const mock = readMockDb();
        admin = await Admin.create(mock.admin);
      }
      return admin;
    } else {
      return readMockDb().admin;
    }
  },

  async updateAdmin(adminData: any) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Admin.findOneAndUpdate({}, adminData, { new: true, upsert: true });
    } else {
      const mock = readMockDb();
      mock.admin = { ...mock.admin, ...adminData };
      writeMockDb(mock);
      return mock.admin;
    }
  },

  // Projects
  async getProjects() {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Project.find({});
    } else {
      return readMockDb().projects;
    }
  },

  async createProject(projectData: any) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Project.create(projectData);
    } else {
      const mock = readMockDb();
      const newProj = { id: `proj-${Date.now()}`, ...projectData };
      mock.projects.push(newProj);
      writeMockDb(mock);
      return newProj;
    }
  },

  async updateProject(id: string, projectData: any) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Project.findByIdAndUpdate(id, projectData, { new: true });
    } else {
      const mock = readMockDb();
      const idx = mock.projects.findIndex((p: any) => p.id === id);
      if (idx === -1) return null;
      mock.projects[idx] = { ...mock.projects[idx], ...projectData };
      writeMockDb(mock);
      return mock.projects[idx];
    }
  },

  async deleteProject(id: string) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Project.findByIdAndDelete(id);
    } else {
      const mock = readMockDb();
      mock.projects = mock.projects.filter((p: any) => p.id !== id);
      writeMockDb(mock);
      return true;
    }
  },

  // Experiences
  async getExperiences() {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Experience.find({});
    } else {
      return readMockDb().experiences;
    }
  },

  async createExperience(expData: any) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Experience.create(expData);
    } else {
      const mock = readMockDb();
      const newExp = { id: `exp-${Date.now()}`, ...expData };
      mock.experiences.push(newExp);
      writeMockDb(mock);
      return newExp;
    }
  },

  async updateExperience(id: string, expData: any) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Experience.findByIdAndUpdate(id, expData, { new: true });
    } else {
      const mock = readMockDb();
      const idx = mock.experiences.findIndex((e: any) => e.id === id);
      if (idx === -1) return null;
      mock.experiences[idx] = { ...mock.experiences[idx], ...expData };
      writeMockDb(mock);
      return mock.experiences[idx];
    }
  },

  async deleteExperience(id: string) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Experience.findByIdAndDelete(id);
    } else {
      const mock = readMockDb();
      mock.experiences = mock.experiences.filter((e: any) => e.id !== id);
      writeMockDb(mock);
      return true;
    }
  },

  // Certifications
  async getCertifications() {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Certification.find({});
    } else {
      return readMockDb().certifications;
    }
  },

  async createCertification(certData: any) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Certification.create(certData);
    } else {
      const mock = readMockDb();
      const newCert = { id: `cert-${Date.now()}`, ...certData };
      mock.certifications.push(newCert);
      writeMockDb(mock);
      return newCert;
    }
  },

  async updateCertification(id: string, certData: any) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Certification.findByIdAndUpdate(id, certData, { new: true });
    } else {
      const mock = readMockDb();
      const idx = mock.certifications.findIndex((c: any) => c.id === id);
      if (idx === -1) return null;
      mock.certifications[idx] = { ...mock.certifications[idx], ...certData };
      writeMockDb(mock);
      return mock.certifications[idx];
    }
  },

  async deleteCertification(id: string) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Certification.findByIdAndDelete(id);
    } else {
      const mock = readMockDb();
      mock.certifications = mock.certifications.filter((c: any) => c.id !== id);
      writeMockDb(mock);
      return true;
    }
  },

  // Documents (Private Vault)
  async getDocuments() {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Document.find({}, { fileContent: 0 }); // Exclude raw base64 content in list for performance
    } else {
      return readMockDb().documents.map(({ fileContent, ...rest }: any) => rest);
    }
  },

  async getDocumentById(id: string) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Document.findById(id);
    } else {
      return readMockDb().documents.find((d: any) => d.id === id) || null;
    }
  },

  async createDocument(docData: any) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Document.create(docData);
    } else {
      const mock = readMockDb();
      const newDoc = { id: `doc-${Date.now()}`, ...docData };
      mock.documents.push(newDoc);
      writeMockDb(mock);
      const { fileContent, ...rest } = newDoc;
      return rest;
    }
  },

  async deleteDocument(id: string) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await Document.findByIdAndDelete(id);
    } else {
      const mock = readMockDb();
      mock.documents = mock.documents.filter((d: any) => d.id !== id);
      writeMockDb(mock);
      return true;
    }
  },

  // Contact messages
  async getMessages() {
    if (MONGODB_URI) {
      await connectToMongo();
      return await ContactMessage.find({});
    } else {
      return readMockDb().messages;
    }
  },

  async createMessage(msgData: any) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await ContactMessage.create(msgData);
    } else {
      const mock = readMockDb();
      const newMsg = { id: `msg-${Date.now()}`, ...msgData };
      mock.messages.push(newMsg);
      writeMockDb(mock);
      return newMsg;
    }
  },

  async deleteMessage(id: string) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await ContactMessage.findByIdAndDelete(id);
    } else {
      const mock = readMockDb();
      mock.messages = mock.messages.filter((m: any) => m.id !== id);
      writeMockDb(mock);
      return true;
    }
  },

  // Shared Links
  async createSharedLink(linkData: any) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await SharedLink.create(linkData);
    } else {
      const mock = readMockDb();
      const newLink = { id: `link-${Date.now()}`, ...linkData };
      mock.sharedLinks = mock.sharedLinks || [];
      mock.sharedLinks.push(newLink);
      writeMockDb(mock);
      return newLink;
    }
  },

  async getSharedLink(token: string) {
    if (MONGODB_URI) {
      await connectToMongo();
      return await SharedLink.findOne({ token });
    } else {
      const mock = readMockDb();
      mock.sharedLinks = mock.sharedLinks || [];
      return mock.sharedLinks.find((l: any) => l.token === token) || null;
    }
  }
};
