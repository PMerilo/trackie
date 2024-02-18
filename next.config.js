/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: [ '@prisma/client', 'bcrypt', 'fs' ]
    },
    output: "standalone",
    typescript: {
        ignoreBuildErrors: true,
    }
}

module.exports = nextConfig
