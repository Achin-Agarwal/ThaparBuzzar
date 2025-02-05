import React from 'react';

const About = () => {
    const teamMembers = [
        { name: "Rohit Foujdar", role: "Project Manager", batch: "MBA Batch 2024-26", description: "Rohit is the driving force behind the Buzzar project. He planned the entire project, managed operations, and acted as the primary liaison between college authorities and student startups. He also played a key role in drafting the privacy policy and ensuring seamless execution." },
        { name: "Satvik Rana", role: "Technical Product Manager", batch: "MBA Batch 2024-26", description: "Satvik, a skilled software engineer, led the tech team by assigning tasks, resolving bottlenecks, and ensuring alignment between technical execution and business objectives. His leadership enabled the team to deliver innovative features under tight deadlines." },
        { name: "Soumya Garg", role: "Graphic Designer", batch: "MBA Batch 2024-26", description: "Soumya designed the entire UI for the website, ensuring a visually appealing user experience. She contributed to strategic decisions, branding, and visual assets, making Buzzar an engaging platform." },
        { name: "Devansh Vashishat", role: "Backend Developer", batch: "CSE Batch 2023-27", description: "Devansh built and maintained the backend infrastructure, ensuring security and scalability. Using MongoDB and JavaScript, he optimized server-side solutions and created APIs for seamless frontend-backend interaction." },
        { name: "Achin Agarwal", role: "Backend & Frontend Developer", batch: "CSE Batch 2023-27", description: "Achin contributed to both backend and frontend tasks. He helped build and optimize backend functionalities, managed the MongoDB database, and integrated APIs for a seamless user experience." },
        { name: "Rishav Kumar", role: "Frontend Developer", batch: "CSE Batch 2023-27", description: "Rishav played a key role in implementing the platform's UI. He ensured smooth navigation and user interaction, aligning frontend development with aesthetic and functional goals." }
    ];

    return (
        <div style={{ fontFamily: 'Poppins, sans-serif', padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>About Us</h1>
            {teamMembers.map((member, index) => (
                <div key={index} style={{ marginBottom: '20px', padding: '10px', borderBottom: '1px solid #ccc' }}>
                    <h2>{member.name}</h2>
                    <p><strong>{member.batch} - {member.role}</strong></p>
                    <p>{member.description}</p>
                </div>
            ))}
        </div>
    );
};

export default About;