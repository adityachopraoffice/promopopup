import { useState } from "react";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { login } from "../shopify.server";

export const loader = async ({ request }) => {
  const errors = await login(request);
  return { errors };
};

export const action = async ({ request }) => {
  const errors = await login(request);
  return { errors };
};

export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData || {};

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: '#ffffff',
      margin: 0,
      padding: '20px'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        body { margin: 0; background: #0f172a; }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 48px;
          max-width: 420px;
          width: 100%;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: float 6s ease-in-out infinite;
        }
        .input-field {
          width: 100%;
          padding: 16px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 16px;
          transition: all 0.3s ease;
          box-sizing: border-box;
          margin-bottom: 8px;
        }
        .input-field:focus {
          outline: none;
          border-color: #6366f1;
          background: rgba(0, 0, 0, 0.4);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(to right, #6366f1, #a855f7);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 24px;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5);
          animation: pulse 2s infinite;
        }
      `}} />

      <div className="glass-card">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '16px', 
            background: 'linear-gradient(135deg, #38bdf8, #818cf8)', 
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '20px', boxShadow: '0 10px 25px -5px rgba(56, 189, 248, 0.5)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome to PromoPopup
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '15px' }}>
            Enter your Shopify store domain to access your dashboard.
          </p>
        </div>

        <Form method="post">
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#cbd5e1' }}>
              Store Domain
            </label>
            <input
              type="text"
              name="shop"
              className="input-field"
              placeholder="e.g. your-store.myshopify.com"
              value={shop}
              onChange={(e) => setShop(e.target.value)}
              autoComplete="on"
            />
            {errors?.shop && (
              <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errors.shop}
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Connect Store
          </button>
        </Form>
      </div>
    </div>
  );
}
