import React from 'react';

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-[#0d1117] text-gray-200 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-[#161b22] border border-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6">Terms of Use for Xiaosave</h1>
        
        <div className="space-y-6 text-gray-300 mt-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Usage Limits</h2>
            <p>Xiaosave is provided as a utility tool for personal use only.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Intellectual Property</h2>
            <p>You are responsible for ensuring you have the right or permission to download any media using this website. Please respect the copyright of content creators.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. Affiliation</h2>
            <p>Xiaosave is an independent tool and is not affiliated with, endorsed by, or sponsored by any social media platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. Liability</h2>
            <p>The service is provided "as is" without warranties of any kind. We are not liable for any misuse of downloaded content.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
