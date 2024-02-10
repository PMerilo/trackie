/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: [ '@prisma/client', 'bcrypt', 'fs' ]
    }
}

module.exports = nextConfig
