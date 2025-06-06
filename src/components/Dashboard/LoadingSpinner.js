const LoadingSpinner = ({ message }) => (
    <div className="text-center text-white">
        <div className="spinner-border mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        <h4>{message}</h4>
    </div>
);