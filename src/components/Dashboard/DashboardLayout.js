const DashboardLayout = ({ children }) => (
    <div className="min-vh-100"
         style={{
             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
             fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
         }}>
        <div className="container-fluid px-3 py-4">
            {children}
        </div>
    </div>
);