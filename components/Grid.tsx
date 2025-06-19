"use client";

const Grid = () => {
  return (
    <section className="section-padding">
      <div className="container-responsive">
        <h2 className="heading mb-12">About Me</h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 responsive-gap">
            <div className="space-y-6">
              <div className="bg-black/20 rounded-lg card-padding border border-blue-900/50">
                <h3 className="text-responsive-xl font-semibold text-blue-200 mb-4">🎓 Student & Developer</h3>
                <p className="text-gray-200 leading-relaxed text-responsive-base">
                  I&apos;m a Computer Engineering student at Antalya Bilim University, currently in my final year. 
                  I&apos;ve been learning programming and working on projects to build practical skills in both 
                  web development and AI/ML.
                </p>
              </div>
              
              <div className="bg-black/20 rounded-lg card-padding border border-blue-900/50">
                <h3 className="text-responsive-xl font-semibold text-blue-200 mb-4">💻 What I Work On</h3>
                <p className="text-gray-200 leading-relaxed text-responsive-base">
                  I enjoy building web applications using React and TypeScript for the frontend, and Python 
                  for backend development. I&apos;ve also been exploring computer vision and machine learning, 
                  particularly working with image recognition systems.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-black/20 rounded-lg card-padding border border-blue-900/50">
                <h3 className="text-responsive-xl font-semibold text-blue-200 mb-4">🏢 Experience</h3>
                <p className="text-gray-200 leading-relaxed text-responsive-base">
                  I completed two internships at Bulutsoft - one focused on full-stack development and another 
                  on digital image processing. These experiences helped me understand how to work on real projects 
                  and collaborate with development teams.
                </p>
              </div>
              
              <div className="bg-black/20 rounded-lg card-padding border border-blue-900/50">
                <h3 className="text-responsive-xl font-semibold text-blue-200 mb-4">🎯 Goals</h3>
                <p className="text-gray-200 leading-relaxed text-responsive-base">
                  I&apos;m looking to gain more experience in software development, particularly in areas where 
                  I can apply both my technical skills and problem-solving abilities. I&apos;m interested in roles 
                  that involve building meaningful applications and learning from experienced developers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Grid;
