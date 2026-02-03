import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8 border-b border-gray-800 pb-6">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last Updated: February 2, 2026</p>
        </div>

        <div className="space-y-8 text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
          <p className="leading-relaxed">
            Welcome to Echoes of History ("we," "our," or "us"). We are committed to protecting your 
            privacy and ensuring the security of your personal information. This Privacy Policy explains 
            how we collect, use, disclose, and safeguard your information when you use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-medium text-gray-200 mb-3 mt-4">2.1 Personal Information</h3>
          <p className="leading-relaxed mb-3">
            We may collect personal information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact information (email address, phone number, mailing address)</li>
            <li>Account credentials (username and password)</li>
            <li>Payment information (processed securely through third-party payment processors)</li>
            <li>Profile information and preferences</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-200 mb-3 mt-4">2.2 Automatically Collected Information</h3>
          <p className="leading-relaxed mb-3">
            When you access our services, we may automatically collect certain information, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Usage data (pages visited, time spent, click patterns)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
          <p className="leading-relaxed mb-3">We use the collected information for various purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide, maintain, and improve our services</li>
            <li>To process transactions and send related information</li>
            <li>To communicate with you about updates, security alerts, and support messages</li>
            <li>To personalize your experience and deliver targeted content</li>
            <li>To monitor and analyze usage patterns and trends</li>
            <li>To detect, prevent, and address technical issues and fraud</li>
            <li>To comply with legal obligations and enforce our terms</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">4. Information Sharing and Disclosure</h2>
          <p className="leading-relaxed mb-3">
            We do not sell your personal information. We may share your information in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            <li><strong>With Your Consent:</strong> When you authorize us to share your information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
          <p className="leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
            over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights and Choices</h2>
          <p className="leading-relaxed mb-3">You have certain rights regarding your personal information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">7. Cookies and Tracking Technologies</h2>
          <p className="leading-relaxed">
            We use cookies and similar tracking technologies to enhance your experience. You can control 
            cookie preferences through your browser settings. Please note that disabling cookies may affect 
            the functionality of our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">8. Children's Privacy</h2>
          <p className="leading-relaxed">
            Our services are not directed to individuals under the age of 13 (or the applicable age of digital 
            consent in your jurisdiction). We do not knowingly collect personal information from children. If 
            you believe we have collected information from a child, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">9. International Data Transfers</h2>
          <p className="leading-relaxed">
            Your information may be transferred to and processed in countries other than your country of residence. 
            We ensure appropriate safeguards are in place to protect your information in accordance with this 
            Privacy Policy and applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to This Privacy Policy</h2>
          <p className="leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by 
            posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use 
            of our services after such changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
          <p className="leading-relaxed mb-3">
            If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
            <p className="font-medium text-white">Echoes of History</p>
            <p>Email: wheatstore123@gmail.com</p>
          </div>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-800">
        <p className="text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Echoes of History. All rights reserved.
        </p>
      </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;