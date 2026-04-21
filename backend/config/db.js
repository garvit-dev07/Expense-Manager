const mongoose = require('mongoose');
const dns = require('dns');

const configureDnsForSrv = (mongoURI) => {
  if (!mongoURI.startsWith('mongodb+srv://')) {
    return;
  }

  const dnsServers = (process.env.DNS_SERVERS || '')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
  }
};

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error('MONGO_URI is missing. Add it to backend/.env');
  }

  try {
    configureDnsForSrv(mongoURI);
    const connection = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);

    if (error.message.includes('querySrv ECONNREFUSED')) {
      console.error('Fix: your DNS resolver is refusing MongoDB SRV lookup. Try Google DNS/Cloudflare DNS, disable VPN/proxy, or use the non-SRV Atlas connection string.');
    }

    process.exit(1);
  }
};

module.exports = connectDB;
