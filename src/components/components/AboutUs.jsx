import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import avatar from '../assets/images/avatar.jpg';

const AboutUs = () => {
  // Team members data with extended bios
  const team = [
    {
      name: "Nikhil Raikwar",
      role: "Tech Lead",
      bio: "Nikhil is the technical visionary behind CritiqueConnect. With over 8 years of experience in full-stack development, he architected our platform from the ground up with a focus on scalability and user experience. His passion for creating tools that empower creators drives our product innovation.",
      expertise: ["System Architecture", "Backend Development", "Database Design", "API Integration"]
    },
    {
      name: "Gaurav Verma",
      role: "Product Strategist",
      bio: "As our product strategist, Gaurav bridges the gap between user needs and technical possibilities. His background in UX research and project management ensures that every feature we build serves a genuine user need. He's constantly speaking with users and refining our product roadmap.",
      expertise: ["Product Management", "UX Research", "Strategic Planning", "Growth Metrics"]
    },
    {
      name: "Mohd Anas",
      role: "UX Designer",
      bio: "Anas brings creativity and user empathy to every screen of CritiqueConnect. His work goes beyond aesthetics to create intuitive workflows that make complex feedback processes feel simple and natural. He's dedicated to ensuring that every user journey feels thoughtful and cohesive.",
      expertise: ["UI/UX Design", "User Testing", "Wireframing", "Design Systems"]
    },
    {
      name: "Hritik Roshan",
      role: "Marketing & Growth",
      bio: "Hritik Roshan leads our outreach and community building efforts. With experience in both traditional marketing and community management, he's focused on growing our user base while preserving the supportive culture that makes CritiqueConnect special. He's passionate about creator empowerment.",
      expertise: ["Community Building", "Content Strategy", "Partnership Development", "User Acquisition"]
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                About CritiqueConnect
              </span>
            </h1>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              We're building a platform where creators of all types can receive honest, 
              constructive feedback to refine their ideas and grow their skills.
            </p>
          </div>

          {/* Our Story Section */}
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-900/20 overflow-hidden transition-all duration-500 hover:shadow-purple-900/30 mb-16 p-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Our Story</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                CritiqueConnect began in 2022 when our founding team members noticed a common problem across creative and technical fields: 
                getting useful, constructive feedback on works-in-progress was difficult and often discouraging.
              </p>
              <p>
                As creators ourselves, we wanted a dedicated space where people could share their work and receive thoughtful critiques 
                from peers and professionals who understand the creative process - without the noise and negativity often found on general social platforms.
              </p>
              <p>
                What started as a simple tool for our own projects has evolved into a comprehensive platform serving creators across multiple disciplines, 
                from software development and writing to design and art. Today, we're proud to support a growing community that values honesty, constructive dialogue, and mutual growth.
              </p>
            </div>
          </div>

          {/* Our Mission Section */}
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-900/20 overflow-hidden transition-all duration-500 hover:shadow-purple-900/30 mb-16 p-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Our Mission</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                At CritiqueConnect, we believe that quality feedback is the catalyst for growth and innovation. Our mission is to create a supportive 
                environment where creators can:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Share their work without fear of judgement</li>
                <li>Receive specific, actionable feedback from relevant perspectives</li>
                <li>Build meaningful connections with peers and mentors</li>
                <li>Continuously improve their craft through constructive dialogue</li>
              </ul>
              <p>
                We're dedicated to fostering a community that values respect, honesty, and growth - one critique at a time.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-100 mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-xl border border-purple-900/20 overflow-hidden transition-all duration-300 hover:shadow-purple-900/30 hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <img 
                      src={avatar} 
                      alt={member.name} 
                      className="w-20 h-20 rounded-full object-cover border-2 border-purple-500 shadow-md mr-5" 
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-100">{member.name}</h3>
                      <p className="text-purple-400 font-medium">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">{member.bio}</p>
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex} 
                          className="px-3 py-1 text-xs font-medium text-purple-300 bg-purple-900/30 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-6xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-100 mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Value 1 */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-xl border border-purple-900/20 p-6 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <h3 className="text-xl font-bold text-gray-100 mb-3">Honesty & Respect</h3>
              <p className="text-gray-300">
                We believe in feedback that's both truthful and respectful. The best critiques come from a place of genuine desire to help others improve.
              </p>
            </div>
            
            {/* Value 2 */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-xl border border-purple-900/20 p-6 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <h3 className="text-xl font-bold text-gray-100 mb-3">Continuous Growth</h3>
              <p className="text-gray-300">
                We're committed to the belief that everyone - regardless of skill level - has room to grow and improve through thoughtful feedback.
              </p>
            </div>
            
            {/* Value 3 */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-xl border border-purple-900/20 p-6 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-500"></div>
              <h3 className="text-xl font-bold text-gray-100 mb-3">Community</h3>
              <p className="text-gray-300">
                We're building more than a platform - we're cultivating a community of creators who support each other's journey of improvement.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs; 