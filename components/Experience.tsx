"use client";

const Experience = () => {
  return (
    <section className="section-padding" id="experience">
      <div className="container-responsive">
        <h2 className="heading mb-12">EXPERIENCE</h2>
        <div className="mb-16">
          <h3 className="text-responsive-2xl font-bold text-blue-200 mb-6">Bulutsoft</h3>
          <div className="ml-4 space-y-6">
            <div className="bg-black/20 rounded-lg card-padding border border-blue-900/50">
              <h4 className="text-responsive-xl font-semibold text-blue-100 mb-2">Full Stack Developer Intern</h4>
              <span className="block text-blue-300 mb-4 text-responsive-base">Jul 2023 – Sep 2023</span>
              <p className="text-gray-200 text-responsive-base leading-relaxed">
                Built full-stack applications using modern web technologies. Worked on both backend and frontend of live projects, implementing user authentication, CRUD operations, RESTful APIs, and responsive UIs. Designed database schemas, integrated third-party services, and participated in code reviews.
              </p>
            </div>
            <div className="bg-black/20 rounded-lg card-padding border border-blue-900/50">
              <h4 className="text-responsive-xl font-semibold text-blue-100 mb-2">Digital Image Processing Intern</h4>
              <span className="block text-blue-300 mb-4 text-responsive-base">Jan 2024 – Mar 2024</span>
              <p className="text-gray-200 text-responsive-base leading-relaxed">
                Worked on computer vision applications using deep learning. Designed and trained neural network models with TensorFlow and PyTorch for object and face recognition. Used ResNet architectures to extract feature vectors for classification and verification. Built tools for real-time face identification and comparison. Gained experience with image datasets, preprocessing, augmentation, and evaluation metrics.
              </p>
            </div>
          </div>
        </div>

        <h2 className="heading mb-12">EDUCATION</h2>
        <div className="space-y-6 mb-16">
          <div className="bg-black/20 rounded-lg card-padding border border-blue-900/50">
            <h3 className="text-responsive-2xl font-bold text-blue-200 mb-2">Antalya Bilim University</h3>
            <p className="text-responsive-xl text-blue-100 font-semibold mb-2">BSc in Computer Engineering</p>
            <p className="text-blue-300 text-responsive-base mb-2">Graduated with a GPA of 3.76 – Ranked Top 3 in the Computer Engineering Department</p>
            <p className="text-gray-300 text-responsive-base">2021 – 2025</p>
          </div>
          <div className="bg-black/20 rounded-lg card-padding border border-blue-900/50">
            <h3 className="text-responsive-2xl font-bold text-blue-200 mb-2">Muratpaşa Türk Telekom Anadolu Lisesi</h3>
            <p className="text-gray-300 text-responsive-base">2017 – 2021</p>
          </div>
          <div className="bg-black/20 rounded-lg card-padding border border-blue-900/50">
            <h3 className="text-responsive-2xl font-bold text-blue-200 mb-2">Language Proficiency</h3>
            <p className="text-gray-300 text-responsive-base">English: C1 level (IELTS 7.5 – 2023)</p>
          </div>
        </div>

        <h2 className="heading mb-12">TECHNICAL SKILLS</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 responsive-gap">
          <div className="bg-black/20 rounded-lg card-padding border border-blue-900/50">
            <h4 className="text-responsive-xl font-semibold text-blue-100 mb-4">Languages:</h4>
            <p className="text-gray-200 text-responsive-base">Python, JavaScript, TypeScript, HTML, CSS, Java, C++, SQL, C#</p>
          </div>
          <div className="bg-black/20 rounded-lg card-padding border border-blue-900/50">
            <h4 className="text-responsive-xl font-semibold text-blue-100 mb-4">Frameworks:</h4>
            <p className="text-gray-200 text-responsive-base">React, Node.js, TensorFlow, PyTorch, Django, React Native</p>
          </div>
          <div className="bg-black/20 rounded-lg card-padding border border-blue-900/50 md:col-span-2 lg:col-span-1">
            <h4 className="text-responsive-xl font-semibold text-blue-100 mb-4">Tools & Technologies:</h4>
            <p className="text-gray-200 text-responsive-base">Git, Docker, Postman, MongoDB, RESTful APIs, CI/CD</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
