import React from "react";
import Navbar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import {
    Shield,
    Eye,
    Database,
    Lock,
    UserCheck,
    AlertTriangle,
} from "lucide-react";

const PrivacyPolicy = () => {
    const sections = [
        {
            icon: Database,
            title: "1. Information We Collect",
            content:
                "We collect information you provide directly to us, such as when you create an account, list a property, book a service, or contact us. This includes your name, email address, phone number, and property details.",
        },
        {
            icon: Eye,
            title: "2. How We Use Your Information",
            content:
                "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and promotional offers.",
        },
        {
            icon: Shield,
            title: "3. Information Sharing",
            content:
                "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with service providers who assist us in operating our platform.",
        },
        {
            icon: Lock,
            title: "4. Data Security",
            content:
                "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.",
        },
        {
            icon: UserCheck,
            title: "5. Your Rights",
            content:
                "You have the right to access, update, or delete your personal information. You can also opt out of certain communications from us. Contact us if you wish to exercise these rights.",
        },
        {
            icon: AlertTriangle,
            title: "6. Changes to This Policy",
            content:
                "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date.",
        },
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="container mx-auto px-4 py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-[#f73c56] rounded-full">
                                <Shield className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            Last Updated: November 7, 2024
                        </p>
                    </div>

                    {/* Privacy Sections */}
                    <div className="max-w-4xl mx-auto space-y-8">
                        {sections.map((section, index) => {
                            const IconComponent = section.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="p-3 bg-[#f73c56] bg-opacity-10 rounded-lg">
                                                <IconComponent className="w-6 h-6 text-[#f73c56]" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                                {section.title}
                                            </h2>
                                            <p className="text-gray-700 leading-relaxed">
                                                {section.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Contact Information */}
                    <div className="max-w-4xl mx-auto mt-12">
                        <div className="bg-blue-50 rounded-lg p-8 text-center">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Questions About This Policy?
                            </h2>
                            <p className="text-gray-700 mb-6">
                                If you have any questions about this Privacy Policy or our data practices, please contact us.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="text-gray-600">Email:</span>
                                    <a
                                        href="mailto:privacy@monositi.com"
                                        className="text-[#f73c56] hover:underline font-medium"
                                    >
                                        privacy@monositi.com
                                    </a>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="text-gray-600">Phone:</span>
                                    <a
                                        href="tel:+911234567890"
                                        className="text-[#f73c56] hover:underline font-medium"
                                    >
                                        +91 12345 67890
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="max-w-4xl mx-auto mt-8">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <div className="flex items-start space-x-3">
                                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                        Important Notice
                                    </h3>
                                    <p className="text-yellow-700 text-sm">
                                        By using Monositi's services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with any part of this policy, please do not use our services.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;