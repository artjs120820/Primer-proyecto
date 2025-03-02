/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol : 'https',
                hostname : 'www.oracle.com',
                port: '',
                pathname : '/**'
            },
            {
                protocol : 'https',
                hostname : 'pokefanaticos.com',
                port: '',
                pathname : '/**'
            },
        ]
    }
}

module.exports = nextConfig
