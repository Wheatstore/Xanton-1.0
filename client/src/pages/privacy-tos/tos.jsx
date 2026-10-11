import Navbar from "../../components/navbar/navbar";
import { MuseumFooter } from "../../components/museum/MuseumPage";
import LegalLayout from "../../components/museum/LegalLayout";
const sections = [["policy-1", "1. Agreement to Terms"], ["policy-2", "2. Description of Services"], ["policy-3", "3. User Accounts"], ["policy-4", "4. User Conduct and Prohibited Activities"], ["policy-5", "5. Intellectual Property Rights"], ["policy-6", "6. Payment and Subscription Terms"], ["policy-7", "7. Privacy and Data Protection"], ["policy-8", "8. Third-Party Links and Services"], ["policy-9", "9. Disclaimers and Limitations of Liability"], ["policy-10", "10. Indemnification"], ["policy-11", "11. Dispute Resolution"], ["policy-12", "12. Changes to Terms"], ["policy-13", "13. Termination"], ["policy-14", "14. Severability and Waiver"], ["policy-15", "15. Entire Agreement"], ["policy-16", "16. Contact Information"]];
export default function TermsOfService() { return <div className="mp-page"><Navbar/><LegalLayout title="Terms of Service" sections={sections}>
<section id="policy-1">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using the services provided by Echoes of History (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;),
              you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms,
              please do not use our services. These Terms constitute a legally binding agreement between you
              and Echoes of History.
            </p>
          </section>

          <section id="policy-2">
            <h2>2. Description of Services</h2>
            <p>
              Echoes of History provides historical and cultural content, educational resources, and related
              services (collectively, the &quot;Services&quot;). We reserve the right to modify, suspend, or discontinue
              any aspect of the Services at any time without prior notice. We are not liable for any
              modification, suspension, or discontinuation of the Services.
            </p>
          </section>

          <section id="policy-3">
            <h2>3. User Accounts</h2>

            <h3>3.1 Account Registration</h3>
            <p>
              To access certain features of our Services, you may be required to create an account. When
              creating an account, you must provide accurate, complete, and current information. You are
              responsible for maintaining the confidentiality of your account credentials.
            </p>

            <h3>3.2 Account Responsibilities</h3>
            <p>You agree to:</p>
            <ul>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized access to your account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Ensure that your account information remains accurate and up-to-date</li>
            </ul>

            <h3>3.3 Account Termination</h3>
            <p>
              We reserve the right to suspend or terminate your account at our discretion, including for
              violations of these Terms, fraudulent activity, or any conduct we deem harmful to our Services
              or other users.
            </p>
          </section>

          <section id="policy-4">
            <h2>4. User Conduct and Prohibited Activities</h2>
            <p>When using our Services, you agree not to:</p>
            <ul>
              <li>Violate any applicable laws, regulations, or third-party rights</li>
              <li>Engage in any fraudulent, abusive, or harmful activities</li>
              <li>Upload or transmit viruses, malware, or any malicious code</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Interfere with or disrupt the integrity or performance of our Services</li>
              <li>Use automated systems (bots, scrapers) without our express permission</li>
              <li>Impersonate any person or entity, or falsely represent your affiliation</li>
              <li>Harvest or collect information about other users without their consent</li>
              <li>Post or transmit content that is illegal, offensive, or infringes on others&apos; rights</li>
            </ul>
          </section>

          <section id="policy-5">
            <h2>5. Intellectual Property Rights</h2>

            <h3>5.1 Our Content</h3>
            <p>
              All content, features, and functionality of our Services, including but not limited to text,
              graphics, logos, images, audio, video, software, and data compilations, are the exclusive
              property of Echoes of History or our licensors and are protected by copyright, trademark,
              and other intellectual property laws.
            </p>

            <h3>5.2 Limited License</h3>
            <p>
              We grant you a limited, non-exclusive, non-transferable, revocable license to access and use
              our Services for personal, non-commercial purposes, subject to these Terms. This license does
              not include the right to:
            </p>
            <ul>
              <li>Modify, reproduce, or create derivative works from our content</li>
              <li>Distribute, sell, or commercially exploit our content</li>
              <li>Remove or alter any copyright, trademark, or proprietary notices</li>
              <li>Use our content in any manner that could damage or disparage our reputation</li>
            </ul>

            <h3>5.3 User-Generated Content</h3>
            <p>
              If you submit, post, or upload content to our Services, you grant us a worldwide, non-exclusive,
              royalty-free, perpetual, irrevocable license to use, reproduce, modify, adapt, publish, translate,
              distribute, and display such content in connection with our Services. You represent and warrant
              that you have all necessary rights to grant this license.
            </p>
          </section>

          <section id="policy-6">
            <h2>6. Payment and Subscription Terms</h2>

            <h3>6.1 Fees and Billing</h3>
            <p>
              Certain features of our Services may require payment. By purchasing a subscription or making
              a payment, you agree to provide accurate billing information and authorize us to charge the
              applicable fees to your payment method. All fees are non-refundable unless otherwise stated
              or required by law.
            </p>

            <h3>6.2 Subscription Renewal</h3>
            <p>
              Subscriptions automatically renew at the end of each billing period unless you cancel before
              the renewal date. We will charge your payment method on file for the renewal. You may cancel
              your subscription at any time through your account settings.
            </p>

            <h3>6.3 Price Changes</h3>
            <p>
              We reserve the right to modify our pricing at any time. We will provide you with reasonable
              notice of any price changes. Your continued use of the Services after a price change
              constitutes acceptance of the new pricing.
            </p>
          </section>

          <section id="policy-7">
            <h2>7. Privacy and Data Protection</h2>
            <p>
              Your use of our Services is also governed by our Privacy Policy, which is incorporated into
              these Terms by reference. Please review our Privacy Policy to understand how we collect, use,
              and protect your personal information.
            </p>
          </section>

          <section id="policy-8">
            <h2>8. Third-Party Links and Services</h2>
            <p>
              Our Services may contain links to third-party websites, applications, or services that are
              not owned or controlled by Echoes of History. We are not responsible for the content,
              privacy policies, or practices of any third-party sites or services. You access third-party
              sites at your own risk and should review their terms and privacy policies.
            </p>
          </section>

          <section id="policy-9">
            <h2>9. Disclaimers and Limitations of Liability</h2>

            <h3>9.1 Service Availability</h3>
            <p>
              Our Services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either
              express or implied. We do not warrant that the Services will be uninterrupted, error-free,
              or free from viruses or other harmful components.
            </p>

            <h3>9.2 Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, Echoes of History and its officers, directors,
              employees, and agents shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages, including but not limited to loss of profits, data, use, or goodwill,
              arising from:
            </p>
            <ul>
              <li>Your access to or use of (or inability to access or use) our Services</li>
              <li>Any conduct or content of any third party on our Services</li>
              <li>Any content obtained from our Services</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>

            <h3>9.3 Maximum Liability</h3>
            <p>
              In no event shall our total liability to you for all damages exceed the amount you paid to
              us, if any, in the twelve (12) months preceding the claim, or one hundred dollars ($100),
              whichever is greater.
            </p>
          </section>

          <section id="policy-10">
            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Echoes of History and its officers,
              directors, employees, agents, and affiliates from and against any claims, liabilities,
              damages, losses, and expenses, including reasonable attorneys&apos; fees, arising out of or
              related to your use of our Services, your violation of these Terms, or your violation
              of any rights of a third party.
            </p>
          </section>

          <section id="policy-11">
            <h2>11. Dispute Resolution</h2>

            <h3>11.1 Informal Resolution</h3>
            <p>
              Before filing a claim, you agree to contact us and attempt to resolve the dispute informally
              by sending a written notice describing the nature and basis of the claim and the relief sought.
            </p>

            <h3>11.2 Governing Law</h3>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction],
              without regard to its conflict of law provisions.
            </p>

            <h3>11.3 Arbitration</h3>
            <p>
              Any dispute arising from these Terms or your use of our Services shall be resolved through
              binding arbitration in accordance with the rules of [Arbitration Organization], rather than
              in court, except that you may assert claims in small claims court if your claims qualify.
            </p>
          </section>

          <section id="policy-12">
            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of material
              changes by posting the updated Terms on our Services and updating the &quot;Last Updated&quot; date.
              Your continued use of the Services after such changes constitutes acceptance of the modified
              Terms. If you do not agree to the changes, you must discontinue use of our Services.
            </p>
          </section>

          <section id="policy-13">
            <h2>13. Termination</h2>
            <p>
              We may terminate or suspend your access to our Services immediately, without prior notice
              or liability, for any reason, including breach of these Terms. Upon termination, your right
              to use the Services will immediately cease. All provisions of these Terms that by their
              nature should survive termination shall survive, including ownership provisions, warranty
              disclaimers, indemnity, and limitations of liability.
            </p>
          </section>

          <section id="policy-14">
            <h2>14. Severability and Waiver</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision
              will be limited or eliminated to the minimum extent necessary so that these Terms will
              otherwise remain in full force and effect.
            </p>
            <p>
              Our failure to enforce any right or provision of these Terms will not be considered a
              waiver of those rights.
            </p>
          </section>

          <section id="policy-15">
            <h2>15. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy and any other legal notices published by us
              on the Services, constitute the entire agreement between you and Echoes of History regarding
              your use of our Services and supersede all prior agreements and understandings.
            </p>
          </section>

          <section id="policy-16">
            <h2>16. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div>
              <p>Echoes of History</p>
              <p>Email: wheatstore123.com</p>
            </div>
          </section>
</LegalLayout><MuseumFooter/></div>; }
