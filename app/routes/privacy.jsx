import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div style={{
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      lineHeight: '1.6',
      color: '#333',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      <h1 style={{ fontSize: '32px', borderBottom: '2px solid #eaeaea', paddingBottom: '10px' }}>Privacy Policy for PromoPopup</h1>
      <p><strong>Last Updated: October 3, 2026</strong></p>
      
      <p>PromoPopup ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and shared when you install or use the PromoPopup app in connection with your Shopify-supported store.</p>
      
      <h2 style={{ fontSize: '24px', marginTop: '30px' }}>1. Information We Collect</h2>
      <p>When you install the App, we automatically access certain types of information from your Shopify account to provide our services:</p>
      <ul>
        <li><strong>Store Information:</strong> We collect your Shopify store domain and basic profile information to authenticate your account and process billing via Shopify.</li>
        <li><strong>App Settings:</strong> We store the configuration settings you create within the app (e.g., popup text, colors, timers, and image URLs) in our secure database to display them on your storefront.</li>
      </ul>
      <p><strong>Note on Customer Data:</strong> PromoPopup <strong>DOES NOT</strong> collect, store, or track any Personal Identifiable Information (PII) from your store's visitors or customers. The app uses a standard browser <code>localStorage</code> flag solely to prevent the popup from displaying multiple times to the same visitor.</p>
      
      <h2 style={{ fontSize: '24px', marginTop: '30px' }}>2. How We Use Your Information</h2>
      <p>We use the collected information to:</p>
      <ul>
        <li>Provide, operate, and maintain the App.</li>
        <li>Process subscriptions and billing through Shopify's secure Billing API.</li>
        <li>Provide customer support and respond to your inquiries.</li>
        <li>Comply with legal obligations and Shopify's App Store requirements.</li>
      </ul>
      
      <h2 style={{ fontSize: '24px', marginTop: '30px' }}>3. Sharing Your Information</h2>
      <p>We do not sell your personal information. We only share information in the following circumstances:</p>
      <ul>
        <li><strong>Service Providers:</strong> We use secure, industry-standard third-party services (Vercel for hosting, Neon for database infrastructure) to operate the App.</li>
        <li><strong>Legal Compliance:</strong> We may share your information to comply with applicable laws and regulations, or to respond to a subpoena, search warrant, or other lawful request for information we receive.</li>
      </ul>
      
      <h2 style={{ fontSize: '24px', marginTop: '30px' }}>4. Data Retention and Deletion</h2>
      <p>We retain your store configuration data for as long as the App is installed on your store. When you uninstall the App, we automatically delete your configuration data and session information from our active databases within 48 hours, in compliance with Shopify's mandatory data redaction policies.</p>
      
      <h2 style={{ fontSize: '24px', marginTop: '30px' }}>5. Your Rights</h2>
      <p>If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us.</p>
      
      <h2 style={{ fontSize: '24px', marginTop: '30px' }}>6. Changes</h2>
      <p>We may update this privacy policy from time to time in order to reflect changes to our practices or for other operational, legal, or regulatory reasons.</p>
      
      <h2 style={{ fontSize: '24px', marginTop: '30px' }}>7. Contact Us</h2>
      <p>For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by email at <strong>support@promopopup.app</strong>.</p>
    </div>
  );
}
