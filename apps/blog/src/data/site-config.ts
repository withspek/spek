export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
};

const siteConfig: SiteConfig = {
    title: 'Spek',
    subtitle: 'Realtime public developer communities',
    description: 'A Real-time search indexable public communities for developers',
    image: {
        src: '/dante-preview.jpg',
        alt: 'Spek Blog'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Tags',
            href: '/tags'
        }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Contact',
            href: '/contact'
        },
        {
            text: 'Terms',
            href: '/terms'
        }
    ],
    socialLinks: [
        {
            text: 'Github',
            href: 'https://github.com/irere123/spek'
        },
        {
            text: 'Spek',
            href: 'https://spek.vercel.app/'
        },
        {
            text: 'X/Twitter',
            href: 'https://twitter.com/irere_emmanuel'
        }
    ],
    hero: {
        title: 'Engineering'
    },
    subscribe: {
        title: 'Subscribe to Spek Newsletter',
        text: 'One update per week. All the latest posts directly in your inbox.',
        formUrl: '#'
    },
    postsPerPage: 8
};

export default siteConfig;
