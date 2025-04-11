import { Link } from 'react-router-dom';
import avatar from '../assets/images/avatar.jpg';

const FoundersSection = () => {
  // Founders data with roles and contributions
  const founders = [
    {
      name: "Nikhil Raikwar",
      role: "Tech Lead",
      contribution: "Architected the core platform and led the development of our innovative feedback system."
    },
    {
      name: "Gaurav Verma",
      role: "Product Strategist",
      contribution: "Shaped the product vision and guided the platform's development to meet real-world needs."
    },
    {
      name: "Mohd Anas",
      role: "UX Designer",
      contribution: "Created the intuitive user experience that makes giving and receiving feedback seamless."
    },
    {
      name: "Aakash Singh",
      role: "Marketing & Growth",
      contribution: "Drives our outreach strategy and builds relationships with communities and organizations."
    }
  ];

  return (
    <section id='founders' className="bg-gray-900 py-20">
      {/* Container to heading and founder blocks */}
      <div className='max-w-6xl px-5 mx-auto mt-12 text-center'>
        {/* Heading */}
        <h2 className='text-4xl font-extrabold text-center mb-10'>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            Meet Our Founding Team
          </span>
        </h2>
        
        {/* Founders Container */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {founders.map((founder, index) => (
            <div key={index} className='flex flex-col items-center p-6 space-y-6 rounded-lg bg-gray-800/70 backdrop-blur-sm border border-purple-900/20 shadow-xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-purple-900/20'>
              <img 
                src={avatar} 
                className='w-24 h-24 -mt-14 rounded-full object-cover border-4 border-gray-900 shadow-md' 
                alt={founder.name} 
              />
              <h5 className='text-lg font-bold text-gray-100'>{founder.name}</h5>
              <p className='text-sm font-medium text-purple-400'>{founder.role}</p>
              <p className='text-sm text-gray-300'>
                {founder.contribution}
              </p>
            </div>
          ))}
        </div>
        
        {/* Button */}
        <div className='my-16'>
          <Link
            to='/about-us'
            className='inline-block px-6 py-3 text-white font-medium bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20'
          >
            Learn More About Our Team
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
