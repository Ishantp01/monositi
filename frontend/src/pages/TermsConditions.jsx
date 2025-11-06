import React from "react";
import Navbar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import {
  Shield,
  FileText,
  Users,
  AlertCircle,
  Lock,
  Scale,
} from "lucide-react";

const TermsConditions = () => {
  const sections = [
    {
      icon: FileText,
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using Monositi, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms and Conditions, please do not use our services.",
    },
    {
      icon: Users,
      title: "2. User Accounts",
      content:
        "You are responsible for safeguarding the password that you use to access the service. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.",
    },
    {
      icon: Shield,
      title: "3. Property Listings",
      content:
        "Property owners and agents are responsible for the accuracy of the information provided in their listings. Monositi reserves the right to remove any listing that violates our guidelines or contains misleading information.",
    },
    {
      icon: Lock,
      title: "4. Privacy & Data Protection",
      content:
        "We are committed to protecting your personal information. All data collected is used in accordance with our Privacy Policy. We do not sell or share your personal information with third parties without your consent.",
    },
    {
      icon: Scale,
      title: "5. Service Provider Responsibilities",
      content:
        "Service providers must maintain professional standards, provide accurate service descriptions, and fulfill bookings as agreed. Failure to meet these standards may result in account suspension or termination.",
    },
    {
      icon: AlertCircle,
      title: "6. Liability & Disclaimers",
      content:
        "Monositi acts as a platform connecting property seekers with property owners and service providers with customers. We are not responsible for the actual transactions, property conditions, or service quality. Users engage at their own risk.",
    },
  ];

  const additionalTerms = [
    {
      title: "Payment & Refunds",
      items: [
        "All payments are processed securely through our payment gateway",
        "Refund requests must be made within 24 hours of booking",
        "Processing fees are non-refundable",
        "Disputed amounts will be investigated within 7-10 business days",
      ],
    },
    {
      title: "User Conduct",
      items: [
        "Users must not post false, misleading, or fraudulent content",
        "Harassment, discrimination, or abusive behavior is strictly prohibited",
        "Spam, advertising, or promotional content is not allowed",
        "Users must respect intellectual property rights",
      ],
    },
    {
      title: "Account Termination",
      items: [
        "We reserve the right to suspend or terminate accounts that violate our terms",
        "Users can request account deletion at any time",
        "Terminated accounts forfeit any unused credits or subscriptions",
        "We may retain certain information as required by law",
      ],
    },
    {
      title: "Modifications to Terms",
      items: [
        "We reserve the right to modify these terms at any time",
        "Users will be notified of significant changes via email",
        "Continued use of the service constitutes acceptance of modified terms",
        "Users may terminate their account if they disagree with changes",
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#f73c56] to-[#e9334e] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <FileText className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Terms & Conditions
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Please read these terms carefully before using our services
              </p>
              <p className="text-sm text-white/80 mt-4">
                Last Updated: November 6, 2025
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Monositi
              </h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms and Conditions ("Terms") govern your access to and
                use of Monositi's platform, including any content,
                functionality, and services offered on or through our website
                and mobile applications (collectively, the "Service"). By using
                our Service, you acknowledge that you have read, understood, and
                agree to be bound by these Terms.
              </p>
            </div>

            {/* Main Sections */}
            <div className="space-y-6 mb-8">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md p-8"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[#f73c56]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {section.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Terms */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Additional Terms
              </h2>
              <div className="space-y-6">
                {additionalTerms.map((term, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {term.title}
                    </h3>
                    <ul className="space-y-2">
                      {term.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start space-x-3"
                        >
                          <span className="text-[#f73c56] mt-1.5">•</span>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Questions or Concerns?
              </h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms and Conditions,
                please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <p>📧 Email: legal@monositi.com</p>
                <p>📞 Phone: +91 98765 43210</p>
                <p>
                  📍 Address: 123 Property Street, Real Estate City, India -
                  400001
                </p>
              </div>
            </div>

            {/* Agreement */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
              <p className="text-blue-900 text-center">
                <strong>By continuing to use Monositi</strong>, you acknowledge
                that you have read, understood, and agree to be bound by these
                Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsConditions;
