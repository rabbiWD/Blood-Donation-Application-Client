import { FaHeartbeat, FaUsers, FaClock } from 'react-icons/fa';

const Features = () => {
    const features = [
        {
            id: 1,
            icon: <FaHeartbeat className="text-4xl text-red-600" />,
            title: "Save Lives",
            description: "Your single donation can save up to three lives. Join our community and become a hero today."
        },
        {
            id: 2,
            icon: <FaUsers className="text-4xl text-red-600" />,
            title: "Large Community",
            description: "Connect with thousands of donors and recipients. Our network ensures help reaches fast."
        },
        {
            id: 3,
            icon: <FaClock className="text-4xl text-red-600" />,
            title: "24/7 Support",
            description: "Emergency blood request system available 24/7 to help you in your most critical times."
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Why Choose Our Platform?
                    </h2>
                    <div className="w-20 h-1 bg-red-600 mx-auto mt-4"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div 
                            key={feature.id} 
                            className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 text-center bg-gray-50"
                        >
                            <div className="flex justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;