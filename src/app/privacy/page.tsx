import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0d1117] text-gray-200 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-[#161b22] border border-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy for Xiaosave</h1>
        <p className="text-sm text-gray-400 mb-8">Effective Date: June 28, 2026</p>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Data Collection</h2>
            <p>We do not collect, store, or transmit any personally identifiable information (PII). Xiaosave functions entirely on your device and our secure edge servers.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Media Links and Downloads</h2>
            <p>When you paste a link, the app processes it directly to fetch media files. We do not store a history of your links or downloads on any external servers. Your history is stored locally on your device.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. Third-Party Services</h2>
            <p>Xiaosave interacts with external services strictly to retrieve requested media. We use Google AdSense for display advertising. These third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites. We are not responsible for their privacy practices.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. Analytics and Tracking</h2>
            <p>We use standard web analytics to understand website traffic, but we do not use invasive third-party tracking SDKs that link your downloads to your identity.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
