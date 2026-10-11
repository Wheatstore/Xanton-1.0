import Navbar from "../../components/navbar/navbar";
import { MuseumFooter } from "../../components/museum/MuseumPage";
import LegalLayout from "../../components/museum/LegalLayout";
const sections = [["policy-1", "1. Introduction"], ["policy-2", "2. Information We Collect"], ["policy-3", "3. How We Use Your Information"], ["policy-4", "4. Information Sharing and Disclosure"], ["policy-5", "5. Data Security"], ["policy-6", "6. Your Rights and Choices"], ["policy-7", "7. Cookies and Tracking Technologies"], ["policy-8", "8. Children's Privacy"], ["policy-9", "9. International Data Transfers"], ["policy-10", "10. Changes to This Privacy Policy"], ["policy-11", "11. Contact Us"]];
export default function PrivacyPolicy() { return <div className="mp-page"><Navbar/><LegalLayout title="Privacy Policy" sections={sections}>
<section id="policy-1">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Echoes of History (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your
            privacy and ensuring the security of your personal information. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when you use our services.
          </p>
        </section>

        <section id="policy-2">
          <h2>2. Information We Collect</h2>

          <h3>2.1 Personal Information</h3>
          <p>
            We may collect personal information that you provide directly to us, including:
          </p>
          <ul>
            <li>Name and contact information (email address, phone number, mailing address)</li>
            <li>Account credentials (username and password)</li>
            <li>Payment information (processed securely through third-party payment processors)</li>
            <li>Profile information and preferences</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <p>
            When you access our services, we may automatically collect certain information, including:
          </p>
          <ul>
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Usage data (pages visited, time spent, click patterns)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section id="policy-3">
          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information for various purposes:</p>
          <ul>
            <li>To provide, maintain, and improve our services</li>
            <li>To process transactions and send related information</li>
            <li>To communicate with you about updates, security alerts, and support messages</li>
            <li>To personalize your experience and deliver targeted content</li>
            <li>To monitor and analyze usage patterns and trends</li>
            <li>To detect, prevent, and address technical issues and fraud</li>
            <li>To comply with legal obligations and enforce our terms</li>
          </ul>
        </section>

        <section id="policy-4">
          <h2>4. Information Sharing and Disclosure</h2>
          <p>
            We do not sell your personal information. We may share your information in the following circumstances:
          </p>
          <ul>
            <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            <li><strong>With Your Consent:</strong> When you authorize us to share your information</li>
          </ul>
        </section>

        <section id="policy-5">
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information
            against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission
            over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section id="policy-6">
          <h2>6. Your Rights and Choices</h2>
          <p>You have certain rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
          </ul>
        </section>

        <section id="policy-7">
          <h2>7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your experience. You can control
            cookie preferences through your browser settings. Please note that disabling cookies may affect
            the functionality of our services.
          </p>
        </section>

        <section id="policy-8">
          <h2>8. Children&apos;s Privacy</h2>
          <p>
            Our services are not directed to individuals under the age of 13 (or the applicable age of digital
            consent in your jurisdiction). We do not knowingly collect personal information from children. If
            you believe we have collected information from a child, please contact us immediately.
          </p>
        </section>

        <section id="policy-9">
          <h2>9. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence.
            We ensure appropriate safeguards are in place to protect your information in accordance with this
            Privacy Policy and applicable laws.
          </p>
        </section>

        <section id="policy-10">
          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by
            posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. Your continued use
            of our services after such changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section id="policy-11">
          <h2>11. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <div>
            <p>Echoes of History</p>
            <p>Email: wheatstore123@gmail.com</p>
          </div>
        </section>
</LegalLayout><MuseumFooter/></div>; }
