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
                Developed and deployed several full-stack applications using modern web technologies. Contributed to both backend and frontend sides of live projects, implementing user authentication, CRUD operations, RESTful APIs, and responsive UIs. Designed and maintained scalable database schemas and helped integrate third-party services. Demonstrated ability to work across the stack, learning agile workflows and participating in code reviews and development cycles.
              </p>
            </div>
            <div className="bg-black/20 rounded-lg card-padding border border-blue-900/50">
              <h4 className="text-responsive-xl font-semibold text-blue-100 mb-2">Digital Image Processing Intern</h4>
              <span className="block text-blue-300 mb-4 text-responsive-base">Jan 2024 – Mar 2024</span>
              <p className="text-gray-200 text-responsive-base leading-relaxed">
                Focused on deep learning-based computer vision applications. Designed and trained neural network models using TensorFlow and PyTorch for object and face recognition tasks. Utilized ResNet architectures to extract feature vectors for classification and verification. Delivered practical tools capable of identifying and comparing faces in real-time, which could be adapted for applications such as attendance systems or identity verification. Gained strong hands-on experience with image datasets, preprocessing, augmentation, and evaluation metrics.
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
        </div>

        <h2 className="heading mb-12">TECHNICAL SKILLS</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 responsive-gap">
          <div className="bg-black/20 rounded-lg card-padding border border-blue-900/50">
            <h4 className="text-responsive-xl font-semibold text-blue-100 mb-4">Languages:</h4>
            <p className="text-gray-200 text-responsive-base">Python, Java, JavaScript, HTML, CSS, SQL, C</p>
          </div>
          <div className="bg-black/20 rounded-lg card-padding border border-blue-900/50">
            <h4 className="text-responsive-xl font-semibold text-blue-100 mb-4">Frameworks/Libraries:</h4>
            <p className="text-gray-200 text-responsive-base">Django, Flask, React, Node.js</p>
          </div>
          <div className="bg-black/20 rounded-lg card-padding border border-blue-900/50 md:col-span-2 lg:col-span-1">
            <h4 className="text-responsive-xl font-semibold text-blue-100 mb-4">Tools:</h4>
            <p className="text-gray-200 text-responsive-base">Git, GitHub, Postman, Figma, VS Code, Docker, Firebase</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
