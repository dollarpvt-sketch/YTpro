import React, { useState } from 'react';
import { ArrowRightIcon, UploadIcon } from './IconComponents';

const initialMockProjects = [
    { id: 1, name: 'Team Meeting & Strategy Session', imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600' },
    { id: 2, name: 'Startup Business Plan Presentation', imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=600' },
    { id: 3, name: 'Creative Team Collaboration', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600' },
    { id: 4, name: 'Abstract Tech Backgrounds Vol. 2', imageUrl: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=600' },
    { id: 5, name: 'Digital Marketing Campaign', imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600' },
    { id: 6, name: 'Learn to Code: JavaScript Course', imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600' },
    { id: 7, name: 'Responsive Web Design Showcase', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600' },
    { id: 8, name: 'UI/UX Design Wireframes', imageUrl: 'https://images.unsplash.com/photo-1559028006-44a0a9b39417?q=80&w=600' },
    { id: 9, name: 'Data Science & Analytics Dashboard', imageUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=600' },
    { id: 10, name: 'Corporate Meeting Minutes', imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600' },
    { id: 11, name: 'Project Management Workshop', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600' },
    { id: 12, name: 'Financial Growth Strategy', imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600' },
    { id: 13, name: 'Architectural Design Blueprints', imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600' },
    { id: 14, name: 'Client Onboarding Process', imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600' },
    { id: 15, name: 'Market Research & Analysis', imageUrl: 'https://images.unsplash.com/photo-1554224155-169544351730?q=80&w=600' },
    { id: 16, name: 'Team Brainstorming Session', imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600' },
    { id: 17, name: 'Modern Office Interior Design', imageUrl: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=600' },
    { id: 18, name: 'Investment Portfolio Review', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600' },
    { id: 19, name: 'Science & Lab Research Project', imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600' },
    { id: 20, name: 'Minimalist Laptop Workspace', imageUrl: 'https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?q=80&w=600' },
    { id: 21, name: 'Luxury Real Estate Showcase', imageUrl: 'https://images.unsplash.com/photo-1593642532400-2682810df593?q=80&w=600' },
    { id: 22, name: 'Online Learning Platform Design', imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=600' },
    { id: 23, name: 'Mobile App Development Mockup', imageUrl: 'https://images.unsplash.com/photo-1586953208448-3001a359d24a?q=80&w=600' },
    { id: 24, name: 'Photography Portfolio Layout', imageUrl: 'https://images.unsplash.com/photo-1521185495368-ff1a320717f9?q=80&w=600' },
];

// Helper to read file as Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const ProjectCard: React.FC<{ 
    project: typeof initialMockProjects[0];
    onImageDrop: (file: File) => void; 
}> = ({ project, onImageDrop }) => {
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
             const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                onImageDrop(file);
            }
        }
    };

    return (
        <div 
            className="w-64 h-48 flex-shrink-0 relative rounded-xl overflow-hidden group cursor-pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
             {isDraggingOver && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 border-2 border-dashed border-primary">
                    <UploadIcon className="w-8 h-8 text-primary mb-2" />
                    <p className="text-primary font-semibold">Thả ảnh vào đây</p>
                </div>
            )}
            <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <p className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white leading-tight">{project.name}</p>
        </div>
    );
};

const MarqueeRow: React.FC<{ 
    projects: typeof initialMockProjects; 
    onImageDrop: (projectId: number, file: File) => void;
    rtl?: boolean; 
}> = ({ projects, onImageDrop, rtl }) => {
    const animationClass = rtl ? 'animate-marquee-rtl' : 'animate-marquee-ltr';
    return (
        <div className="w-full inline-flex flex-nowrap overflow-hidden mask-gradient group">
            <div className={`flex items-center justify-start gap-6 group-hover:[animation-play-state:paused] ${animationClass}`}>
                {[...projects, ...projects].map((project, index) => (
                    <ProjectCard 
                        key={`${project.id}-${index}`} 
                        project={project} 
                        onImageDrop={(file) => onImageDrop(project.id, file)}
                    />
                ))}
            </div>
        </div>
    );
};

const RecentProjects: React.FC = () => {
    const [projects, setProjects] = useState(initialMockProjects);

    const handleImageDrop = async (projectId: number, file: File) => {
        try {
            const base64Image = await fileToBase64(file);
            setProjects(prevProjects => 
                prevProjects.map(p => 
                    p.id === projectId ? { ...p, imageUrl: base64Image } : p
                )
            );
        } catch (error) {
            console.error("Error converting file to base64", error);
        }
    };

    const projects_row1 = projects.slice(0, 8);
    const projects_row2 = projects.slice(8, 16);
    const projects_row3 = projects.slice(16, 24);

    return (
        <section id="recent-projects" className="py-6 md:py-8 px-6 md:px-8 bg-gradient-to-br from-green-500/80 to-cyan-600/80 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Dự án gần đây</h2>
                <button className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors">
                    <span>Xem tất cả</span>
                    <ArrowRightIcon className="w-4 h-4" />
                </button>
            </div>
            <div className="space-y-6">
                <MarqueeRow projects={projects_row1} onImageDrop={handleImageDrop} />
                <MarqueeRow projects={projects_row2} onImageDrop={handleImageDrop} rtl />
                <MarqueeRow projects={projects_row3} onImageDrop={handleImageDrop} />
            </div>
        </section>
    );
};

export default RecentProjects;
