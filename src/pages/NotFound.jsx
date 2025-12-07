import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6 max-w-md px-4">
                <div className="space-y-2">
                    <h1 className="text-9xl font-bold text-indigo-600">404</h1>
                    <h2 className="text-3xl font-bold text-slate-800">Page Not Found</h2>
                    <p className="text-slate-500">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="flex gap-4 justify-center">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        icon={ArrowLeft}
                    >
                        Go Back
                    </Button>
                    <Button
                        onClick={() => navigate('/')}
                        icon={Home}
                    >
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
};
