import MainLayout from "@/layouts/MainLayout";


const PageTemplate = ({ title, subtitle, image, children }) => (
  <MainLayout>
    <div className="relative h-[400px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-fixed bg-center bg-cover" style={{ backgroundImage: `url('${image}')` }} />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative z-10 px-4 text-center duration-700 animate-in fade-in zoom-in">
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">{title}</h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-200">{subtitle}</p>
        </div>
    </div>
    <div className="min-h-screen py-16 transition-colors bg-slate-50 dark:bg-slate-950">
        <div className="container max-w-4xl px-4 mx-auto space-y-6 leading-relaxed text-slate-700 dark:text-slate-300">
            {children}
        </div>
    </div>
  </MainLayout>
);


export const Careers = () => (
    <PageTemplate title="Join Our Team" subtitle="Build the future of travel with us." image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070">
        <div className="py-20 text-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50">
            <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">No Openings Right Now</h3>
            <p>We are currently not hiring. Please check back later!</p>
        </div>
    </PageTemplate>
);

export const Blog = () => (
    <PageTemplate title="Orrio Blog" subtitle="Stories, tips, and travel inspiration." image="https://images.unsplash.com/photo-1499750310159-52f0f834631b?q=80&w=2070">
        <div className="py-20 text-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50">
            <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Coming Soon</h3>
            <p>Our writers are busy exploring the world. Stay tuned!</p>
        </div>
    </PageTemplate>
);

export const HelpCenter = () => (
    <PageTemplate title="Help Center" subtitle="We are here to assist you 24/7." image="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072">
        <div className="space-y-8">
            <div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">How can we help?</h3>
                <p>Welcome to the Orrio Help Center. Here you can find answers to frequently asked questions, guides on how to use our platform, and contact information for our support team.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 bg-white border shadow-sm dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800">
                    <h4 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Booking Issues</h4>
                    <p className="text-sm">Trouble with your reservation? Learn how to manage your bookings.</p>
                </div>
                <div className="p-6 bg-white border shadow-sm dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800">
                    <h4 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Payment & Refunds</h4>
                    <p className="text-sm">Understand our payment policies and how refunds work.</p>
                </div>
            </div>
        </div>
    </PageTemplate>
);

export const Terms = () => (
    <PageTemplate title="Terms of Service" subtitle="Please read these terms carefully before using our service." image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070">
        <div className="prose dark:prose-invert max-w-none">
            <h3>1. Introduction</h3>
            <p>Welcome to Orrio. By accessing our website, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
            <h3>2. Use License</h3>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on Orrio's website for personal, non-commercial transitory viewing only.</p>
            <h3>3. Disclaimer</h3>
            <p>The materials on Orrio's website are provided on an 'as is' basis. Orrio makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </div>
    </PageTemplate>
);

export const Privacy = () => (
    <PageTemplate title="Privacy Policy" subtitle="Your data privacy is our top priority." image="https://images.unsplash.com/photo-1506555191898-a76bacf06311?q=80&w=2070">
        <div className="prose dark:prose-invert max-w-none">
            <p>At Orrio, accessible from https://orrio.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Orrio and how we use it.</p>
            <h3>Information We Collect</h3>
            <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
            <h3>How we use your information</h3>
            <p>We use the information we collect in various ways, including to:</p>
            <ul>
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
            </ul>
        </div>
    </PageTemplate>
);

export const FAQ = () => (
    <PageTemplate title="FAQs" subtitle="Frequently Asked Questions" image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070">
        <div className="space-y-4">
            <div className="p-6 bg-white border shadow-sm dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800">
                <h4 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">How do I cancel a booking?</h4>
                <p className="text-slate-600 dark:text-slate-400">You can cancel your booking directly from your user dashboard. Navigate to 'My Bookings', find the booking you wish to cancel, and click the 'Cancel' button. Please note that cancellation policies vary by hotel.</p>
            </div>
            <div className="p-6 bg-white border shadow-sm dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800">
                <h4 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Is payment secure?</h4>
                <p className="text-slate-600 dark:text-slate-400">Yes, absolutely. We use Stripe, a globally trusted payment processor, to handle all transactions. We do not store your credit card information on our servers.</p>
            </div>
            <div className="p-6 bg-white border shadow-sm dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800">
                <h4 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Can I book without an account?</h4>
                <p className="text-slate-600 dark:text-slate-400">Currently, you need to sign in to make a reservation. This allows us to securely manage your booking details and provide you with a personalized dashboard.</p>
            </div>
        </div>
    </PageTemplate>
);