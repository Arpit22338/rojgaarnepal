"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Loader2, X, Check, ChevronDown, ChevronUp,
  User, Briefcase, GraduationCap, Award, Globe,
  Linkedin, Github, Palette, Link2, Languages, Trophy,
  Eye, Save, Send, Zap, Clock, Plus
} from "lucide-react";

// Types
interface TalentFormData {
  title: string;
  bio: string;
  skills: string[];
  specialty: string;
  yearsExperience: string;
  currentStatus: "actively-looking" | "open" | "not-looking";
  availability: string[];
  expectedSalary: string;
  hideSalary: boolean;
  preferredJobTypes: string[];
  preferredIndustries: string[];
  preferredLocations: string[];
  education: string;
  fieldOfStudy: string;
  institution: string;
  portfolioUrl: string;
  noPortfolio: boolean;
  linkedinUrl: string;
  githubUrl: string;
  behanceUrl: string;
  otherLinks: string;
  certifications: string[];
  noCertifications: boolean;
  languages: { language: string; proficiency: string }[];
  achievements: string;
}

const defaultFormData: TalentFormData = {
  title: "",
  bio: "",
  skills: [],
  specialty: "",
  yearsExperience: "",
  currentStatus: "actively-looking",
  availability: [],
  expectedSalary: "",
  hideSalary: false,
  preferredJobTypes: [],
  preferredIndustries: [],
  preferredLocations: [],
  education: "",
  fieldOfStudy: "",
  institution: "",
  portfolioUrl: "",
  noPortfolio: false,
  linkedinUrl: "",
  githubUrl: "",
  behanceUrl: "",
  otherLinks: "",
  certifications: [],
  noCertifications: false,
  languages: [{ language: "", proficiency: "" }],
  achievements: "",
};

const yearsOptions = [
  { value: "0-1", label: "0-1 year" },
  { value: "1-2", label: "1-2 years" },
  { value: "2-5", label: "2-5 years" },
  { value: "5-10", label: "5-10 years" },
  { value: "10+", label: "10+ years" }
];

const statusOptions = [
  { value: "actively-looking", label: "Actively looking for work", emoji: "🔍" },
  { value: "open", label: "Open to opportunities", emoji: "👋" },
  { value: "not-looking", label: "Not looking currently (just showcasing)", emoji: "📢" }
];

const availabilityOptions = ["Full-time", "Part-time", "Contract/Freelance", "Remote only", "On-site", "Hybrid"];

const jobTypeOptions = ["Permanent Position", "Project-based", "Freelance Gigs", "Internship"];

const industries = ["Technology", "Healthcare", "Finance", "Education", "Creative Arts", "Sales & Marketing", "Manufacturing", "Retail", "Hospitality", "Construction", "Other"];

const educationLevels = ["High School", "Bachelor's Degree", "Master's Degree", "PhD", "Other"];

const commonSkills = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL", "MongoDB", "AWS", "Docker", "Git", "CSS", "HTML", "Figma", "Photoshop", "Excel", "Communication", "Leadership", "Project Management", "Video Editing", "Content Writing", "SEO", "Digital Marketing", "Data Analysis"];

const proficiencyLevels = ["Native", "Fluent", "Advanced", "Intermediate", "Basic"];

export default function ShareTalentPage() {
  const [formData, setFormData] = useState<TalentFormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdPostId, setCreatedPostId] = useState<string | null>(null);

  // Skill inputs
  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    headline: true,
    bio: true,
    skills: true,
    experience: true,
    preferences: false,
    education: false,
    portfolio: false,
    certifications: false,
    languages: false,
    achievements: false
  });

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem("talentPostDraft");
    if (draft) {
      try { setFormData({ ...defaultFormData, ...JSON.parse(draft) }); } catch { /* ignore */ }
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (formData.title || formData.bio) {
        localStorage.setItem("talentPostDraft", JSON.stringify(formData));
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [formData]);

  const updateField = <K extends keyof TalentFormData>(field: K, value: TalentFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      updateField("skills", [...formData.skills, trimmed]);
    }
    setSkillInput("");
    setShowSkillSuggestions(false);
  };

  const removeSkill = (skill: string) => {
    updateField("skills", formData.skills.filter(s => s !== skill));
  };

  const addCertification = (cert: string) => {
    const trimmed = cert.trim();
    if (trimmed && !formData.certifications.includes(trimmed)) {
      updateField("certifications", [...formData.certifications, trimmed]);
    }
    setCertInput("");
  };

  const removeCertification = (cert: string) => {
    updateField("certifications", formData.certifications.filter(c => c !== cert));
  };

  const addLocation = (location: string) => {
    const trimmed = location.trim();
    if (trimmed && !formData.preferredLocations.includes(trimmed)) {
      updateField("preferredLocations", [...formData.preferredLocations, trimmed]);
    }
    setLocationInput("");
  };

  const removeLocation = (location: string) => {
    updateField("preferredLocations", formData.preferredLocations.filter(l => l !== location));
  };

  const addLanguage = () => {
    updateField("languages", [...formData.languages, { language: "", proficiency: "" }]);
  };

  const updateLanguage = (index: number, field: "language" | "proficiency", value: string) => {
    const updated = [...formData.languages];
    updated[index] = { ...updated[index], [field]: value };
    updateField("languages", updated);
  };

  const removeLanguage = (index: number) => {
    if (formData.languages.length > 1) {
      updateField("languages", formData.languages.filter((_, i) => i !== index));
    }
  };

  const toggleAvailability = (option: string) => {
    if (formData.availability.includes(option)) {
      updateField("availability", formData.availability.filter(a => a !== option));
    } else {
      updateField("availability", [...formData.availability, option]);
    }
  };

  const toggleJobType = (type: string) => {
    if (formData.preferredJobTypes.includes(type)) {
      updateField("preferredJobTypes", formData.preferredJobTypes.filter(t => t !== type));
    } else {
      updateField("preferredJobTypes", [...formData.preferredJobTypes, type]);
    }
  };

  const toggleIndustry = (industry: string) => {
    if (formData.preferredIndustries.includes(industry)) {
      updateField("preferredIndustries", formData.preferredIndustries.filter(i => i !== industry));
    } else if (formData.preferredIndustries.length < 3) {
      updateField("preferredIndustries", [...formData.preferredIndustries, industry]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Professional headline is required";
    if (formData.title.length > 100) newErrors.title = "Headline must be under 100 characters";
    if (!formData.bio.trim()) newErrors.bio = "Bio is required";
    if (formData.bio.length < 100) newErrors.bio = "Bio must be at least 100 characters";
    if (formData.skills.length < 3) newErrors.skills = "At least 3 skills are required";
    if (!formData.yearsExperience) newErrors.yearsExperience = "Years of experience is required";
    if (formData.availability.length === 0) newErrors.availability = "Select at least one availability option";
    if (!formData.education) newErrors.education = "Education level is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveDraft = () => {
    localStorage.setItem("talentPostDraft", JSON.stringify(formData));
    alert("Draft saved successfully!");
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      document.querySelector(".border-red-500")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    try {
      const postData = {
        title: formData.title,
        bio: formData.bio,
        skills: formData.skills.join(", "),
        specialty: formData.specialty,
        yearsExperience: formData.yearsExperience,
        currentStatus: formData.currentStatus,
        availability: formData.availability,
        expectedSalary: formData.expectedSalary,
        hideSalary: formData.hideSalary,
        preferredJobTypes: formData.preferredJobTypes,
        preferredIndustries: formData.preferredIndustries,
        preferredLocations: formData.preferredLocations,
        education: formData.education,
        fieldOfStudy: formData.fieldOfStudy,
        institution: formData.institution,
        portfolioUrl: formData.noPortfolio ? null : formData.portfolioUrl,
        linkedinUrl: formData.linkedinUrl,
        githubUrl: formData.githubUrl,
        behanceUrl: formData.behanceUrl,
        otherLinks: formData.otherLinks,
        certifications: formData.noCertifications ? null : formData.certifications.join(", "),
        languages: formData.languages.filter(l => l.language && l.proficiency),
        achievements: formData.achievements
      };

      const res = await fetch("/api/talent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to post profile");
      }

      const result = await res.json();
      setCreatedPostId(result.post?.id);
      localStorage.removeItem("talentPostDraft");
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSkillSuggestions = commonSkills.filter(s =>
    s.toLowerCase().includes(skillInput.toLowerCase()) && !formData.skills.includes(s)
  ).slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 pb-60">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground mb-2">Share My Talent</h1>
        <p className="text-muted-foreground">Create your profile to be discovered by employers</p>
      </div>

      <div className="space-y-6">
        {/* Professional Headline */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <button onClick={() => toggleSection("headline")} className="w-full flex items-center justify-between p-6 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><User size={20} className="text-primary" /></div>
              <div className="text-left"><h2 className="text-lg font-bold text-foreground">Professional Headline</h2><p className="text-sm text-muted-foreground">Your title that catches employers&apos; attention</p></div>
            </div>
            {expandedSections.headline ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.headline && (
            <div className="p-6 pt-0">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title <span className="text-red-500">*</span><span className="text-muted-foreground text-xs ml-2">({formData.title.length}/100)</span></label>
                <input type="text" value={formData.title} onChange={(e) => updateField("title", e.target.value.slice(0, 100))} className={`w-full px-4 py-3 rounded-xl border ${errors.title ? "border-red-500" : "border-border"} bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all`} placeholder="e.g. Senior Designer looking for new opportunities" />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                <p className="text-xs text-muted-foreground mt-2">💡 Example: &quot;Full Stack Developer | React & Node.js Expert&quot;</p>
              </div>
            </div>
          )}
        </section>

        {/* Professional Bio */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <button onClick={() => toggleSection("bio")} className="w-full flex items-center justify-between p-6 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Award size={20} className="text-primary" /></div>
              <div className="text-left"><h2 className="text-lg font-bold text-foreground">Professional Bio</h2><p className="text-sm text-muted-foreground">Tell employers about yourself</p></div>
            </div>
            {expandedSections.bio ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.bio && (
            <div className="p-6 pt-0 space-y-4">
              <div className="text-sm text-muted-foreground">{formData.bio.length}/1000 characters (min 100)</div>
              <textarea value={formData.bio} onChange={(e) => updateField("bio", e.target.value.slice(0, 1000))} rows={6} className={`w-full px-4 py-3 rounded-xl border ${errors.bio ? "border-red-500" : "border-border"} bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all resize-none`} placeholder="Tell employers something interesting about yourself..." />
              {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
            </div>
          )}
        </section>

        {/* Skills & Expertise */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <button onClick={() => toggleSection("skills")} className="w-full flex items-center justify-between p-6 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Zap size={20} className="text-primary" /></div>
              <div className="text-left"><h2 className="text-lg font-bold text-foreground">Skills & Expertise</h2><p className="text-sm text-muted-foreground">What you&apos;re good at</p></div>
            </div>
            {expandedSections.skills ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.skills && (
            <div className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Skills <span className="text-red-500">*</span><span className="text-muted-foreground text-xs ml-2">({formData.skills.length}/3 minimum)</span></label>
                <div className="relative">
                  <input type="text" value={skillInput} onChange={(e) => { setSkillInput(e.target.value); setShowSkillSuggestions(true); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(skillInput); } }} onFocus={() => setShowSkillSuggestions(true)} onBlur={() => setTimeout(() => setShowSkillSuggestions(false), 200)} className={`w-full px-4 py-3 rounded-xl border ${errors.skills ? "border-red-500" : "border-border"} bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all`} placeholder="Type a skill and press Enter..." />
                  {showSkillSuggestions && filteredSkillSuggestions.length > 0 && skillInput && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredSkillSuggestions.map(skill => (<button key={skill} type="button" onMouseDown={() => addSkill(skill)} className="w-full px-4 py-2 text-left hover:bg-accent transition-colors text-foreground">{skill}</button>))}
                    </div>
                  )}
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map(skill => (<span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{skill}<button type="button" onClick={() => removeSkill(skill)} className="hover:bg-primary/20 rounded-full p-0.5"><X size={14} /></button></span>))}
                  </div>
                )}
                {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Popular:</span>
                {commonSkills.slice(0, 8).filter(s => !formData.skills.includes(s)).map(skill => (
                  <button key={skill} type="button" onClick={() => addSkill(skill)} className="px-2 py-1 text-xs bg-accent hover:bg-accent/80 text-foreground rounded-full transition-colors">+ {skill}</button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Specialty/Niche <span className="text-muted-foreground text-xs">(Optional)</span></label>
                <input type="text" value={formData.specialty} onChange={(e) => updateField("specialty", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all" placeholder="e.g. E-commerce Design, B2B Sales, Mobile Development" />
              </div>
            </div>
          )}
        </section>

        {/* Experience & Availability */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <button onClick={() => toggleSection("experience")} className="w-full flex items-center justify-between p-6 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Briefcase size={20} className="text-primary" /></div>
              <div className="text-left"><h2 className="text-lg font-bold text-foreground">Experience & Availability</h2><p className="text-sm text-muted-foreground">Your experience and when you&apos;re available</p></div>
            </div>
            {expandedSections.experience ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.experience && (
            <div className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Years of Experience <span className="text-red-500">*</span></label>
                <select value={formData.yearsExperience} onChange={(e) => updateField("yearsExperience", e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.yearsExperience ? "border-red-500" : "border-border"} bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all`}>
                  <option value="">Select Experience</option>
                  {yearsOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
                {errors.yearsExperience && <p className="text-red-500 text-sm mt-1">{errors.yearsExperience}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Current Status <span className="text-red-500">*</span></label>
                <div className="space-y-2">
                  {statusOptions.map(status => (
                    <label key={status.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.currentStatus === status.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                      <input type="radio" name="currentStatus" value={status.value} checked={formData.currentStatus === status.value} onChange={(e) => updateField("currentStatus", e.target.value as "actively-looking" | "open" | "not-looking")} className="w-4 h-4 text-primary focus:ring-primary" />
                      <span>{status.emoji}</span>
                      <span className="text-foreground">{status.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Availability <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availabilityOptions.map(option => (
                    <button key={option} type="button" onClick={() => toggleAvailability(option)} className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${formData.availability.includes(option) ? "bg-primary/10 border-primary text-primary" : "border-border hover:border-primary/50 text-foreground"}`}>
                      {formData.availability.includes(option) && <Check size={16} />}
                      <span className="text-sm font-medium">{option}</span>
                    </button>
                  ))}
                </div>
                {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Expected Salary <span className="text-muted-foreground text-xs">(Optional)</span></label>
                <input type="text" value={formData.expectedSalary} onChange={(e) => updateField("expectedSalary", e.target.value)} disabled={formData.hideSalary} className={`w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all ${formData.hideSalary ? "opacity-50" : ""}`} placeholder="e.g. NRs. 60,000 - 100,000 / month" />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" checked={formData.hideSalary} onChange={(e) => updateField("hideSalary", e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-sm text-muted-foreground">Prefer not to disclose</span>
                </label>
              </div>
            </div>
          )}
        </section>

        {/* Work Preferences */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <button onClick={() => toggleSection("preferences")} className="w-full flex items-center justify-between p-6 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Clock size={20} className="text-primary" /></div>
              <div className="text-left"><h2 className="text-lg font-bold text-foreground">Work Preferences</h2><p className="text-sm text-muted-foreground">What kind of work you&apos;re looking for</p></div>
            </div>
            {expandedSections.preferences ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.preferences && (
            <div className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Preferred Job Types</label>
                <div className="grid grid-cols-2 gap-2">
                  {jobTypeOptions.map(type => (
                    <button key={type} type="button" onClick={() => toggleJobType(type)} className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${formData.preferredJobTypes.includes(type) ? "bg-primary/10 border-primary text-primary" : "border-border hover:border-primary/50 text-foreground"}`}>
                      {formData.preferredJobTypes.includes(type) && <Check size={16} />}
                      <span className="text-sm font-medium">{type}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Preferred Industries <span className="text-muted-foreground text-xs">(Select up to 3)</span></label>
                <div className="flex flex-wrap gap-2">
                  {industries.map(industry => (
                    <button key={industry} type="button" onClick={() => toggleIndustry(industry)} disabled={!formData.preferredIndustries.includes(industry) && formData.preferredIndustries.length >= 3} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${formData.preferredIndustries.includes(industry) ? "bg-primary text-primary-foreground" : "bg-accent text-foreground hover:bg-accent/80"} ${!formData.preferredIndustries.includes(industry) && formData.preferredIndustries.length >= 3 ? "opacity-50 cursor-not-allowed" : ""}`}>
                      {industry}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Preferred Locations</label>
                <input type="text" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addLocation(locationInput); } }} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Kathmandu, Pokhara, Remote (press Enter to add)" />
                {formData.preferredLocations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.preferredLocations.map(loc => (<span key={loc} className="inline-flex items-center gap-1 px-3 py-1 bg-accent text-foreground rounded-full text-sm">{loc}<button type="button" onClick={() => removeLocation(loc)} className="hover:bg-accent/80 rounded-full p-0.5"><X size={14} /></button></span>))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Education */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <button onClick={() => toggleSection("education")} className="w-full flex items-center justify-between p-6 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><GraduationCap size={20} className="text-primary" /></div>
              <div className="text-left"><h2 className="text-lg font-bold text-foreground">Education</h2><p className="text-sm text-muted-foreground">Your educational background</p></div>
            </div>
            {expandedSections.education ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.education && (
            <div className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Highest Education <span className="text-red-500">*</span></label>
                <select value={formData.education} onChange={(e) => updateField("education", e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.education ? "border-red-500" : "border-border"} bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all`}>
                  <option value="">Select Education</option>
                  {educationLevels.map(level => (<option key={level} value={level}>{level}</option>))}
                </select>
                {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Field of Study <span className="text-muted-foreground text-xs">(Optional)</span></label>
                <input type="text" value={formData.fieldOfStudy} onChange={(e) => updateField("fieldOfStudy", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all" placeholder="e.g. Computer Science, Business Administration" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Institution Name <span className="text-muted-foreground text-xs">(Optional)</span></label>
                <input type="text" value={formData.institution} onChange={(e) => updateField("institution", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all" placeholder="e.g. Tribhuvan University" />
              </div>
            </div>
          )}
        </section>

        {/* Portfolio & Links */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <button onClick={() => toggleSection("portfolio")} className="w-full flex items-center justify-between p-6 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Globe size={20} className="text-primary" /></div>
              <div className="text-left"><h2 className="text-lg font-bold text-foreground">Portfolio & Links</h2><p className="text-sm text-muted-foreground">Showcase your work online</p></div>
            </div>
            {expandedSections.portfolio ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.portfolio && (
            <div className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Portfolio Website</label>
                <input type="url" value={formData.portfolioUrl} onChange={(e) => updateField("portfolioUrl", e.target.value)} disabled={formData.noPortfolio} className={`w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all ${formData.noPortfolio ? "opacity-50" : ""}`} placeholder="https://yourportfolio.com" />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" checked={formData.noPortfolio} onChange={(e) => updateField("noPortfolio", e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-sm text-muted-foreground">I don&apos;t have a portfolio</span>
                </label>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2"><Linkedin size={16} /> LinkedIn</label>
                  <input type="url" value={formData.linkedinUrl} onChange={(e) => updateField("linkedinUrl", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all" placeholder="https://linkedin.com/in/arpitkafle" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2"><Github size={16} /> GitHub</label>
                  <input type="url" value={formData.githubUrl} onChange={(e) => updateField("githubUrl", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all" placeholder="https://github.com/arpitkafle" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2"><Palette size={16} /> Behance/Dribbble</label>
                  <input type="url" value={formData.behanceUrl} onChange={(e) => updateField("behanceUrl", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all" placeholder="https://behance.net/arpitkafle" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2"><Link2 size={16} /> Other Links</label>
                  <input type="text" value={formData.otherLinks} onChange={(e) => updateField("otherLinks", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Any other relevant links" />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Certifications */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <button onClick={() => toggleSection("certifications")} className="w-full flex items-center justify-between p-6 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Award size={20} className="text-primary" /></div>
              <div className="text-left"><h2 className="text-lg font-bold text-foreground">Certifications</h2><p className="text-sm text-muted-foreground">Professional certifications you hold</p></div>
            </div>
            {expandedSections.certifications ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.certifications && (
            <div className="p-6 pt-0 space-y-4">
              <div>
                <input type="text" value={certInput} onChange={(e) => setCertInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addCertification(certInput); } }} disabled={formData.noCertifications} className={`w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all ${formData.noCertifications ? "opacity-50" : ""}`} placeholder="AWS Certified, Google Analytics, Adobe Certified (press Enter to add)" />
                {formData.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.certifications.map(cert => (<span key={cert} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{cert}<button type="button" onClick={() => removeCertification(cert)} className="hover:bg-primary/20 rounded-full p-0.5"><X size={14} /></button></span>))}
                  </div>
                )}
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" checked={formData.noCertifications} onChange={(e) => updateField("noCertifications", e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-sm text-muted-foreground">I don&apos;t have certifications</span>
                </label>
              </div>
            </div>
          )}
        </section>

        {/* Languages */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <button onClick={() => toggleSection("languages")} className="w-full flex items-center justify-between p-6 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Languages size={20} className="text-primary" /></div>
              <div className="text-left"><h2 className="text-lg font-bold text-foreground">Languages</h2><p className="text-sm text-muted-foreground">Languages you speak</p></div>
            </div>
            {expandedSections.languages ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.languages && (
            <div className="p-6 pt-0 space-y-3">
              {formData.languages.map((lang, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input type="text" value={lang.language} onChange={(e) => updateLanguage(index, "language", e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Language (e.g. English)" />
                  <select value={lang.proficiency} onChange={(e) => updateLanguage(index, "proficiency", e.target.value)} className="w-40 px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all">
                    <option value="">Proficiency</option>
                    {proficiencyLevels.map(level => (<option key={level} value={level}>{level}</option>))}
                  </select>
                  {formData.languages.length > 1 && (<button type="button" onClick={() => removeLanguage(index)} className="p-2 text-muted-foreground hover:text-red-500 transition-colors"><X size={18} /></button>)}
                </div>
              ))}
              <button type="button" onClick={addLanguage} className="flex items-center gap-2 text-primary hover:underline text-sm"><Plus size={16} /> Add Language</button>
            </div>
          )}
        </section>

        {/* Achievements */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <button onClick={() => toggleSection("achievements")} className="w-full flex items-center justify-between p-6 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Trophy size={20} className="text-primary" /></div>
              <div className="text-left"><h2 className="text-lg font-bold text-foreground">Achievements</h2><p className="text-sm text-muted-foreground">Awards, recognitions, notable projects</p></div>
            </div>
            {expandedSections.achievements ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.achievements && (
            <div className="p-6 pt-0">
              <textarea value={formData.achievements} onChange={(e) => updateField("achievements", e.target.value.slice(0, 500))} rows={4} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 transition-all resize-none" placeholder="Awards, recognitions, notable projects..." />
              <div className="text-right text-sm text-muted-foreground mt-1">{formData.achievements.length}/500 characters</div>
            </div>
          )}
        </section>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-24 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border p-4 z-40">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-3 w-full sm:w-auto">
            <button type="button" onClick={saveDraft} className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-border text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-2"><Save size={18} /> Save Draft</button>
            <button type="button" onClick={() => setShowPreview(true)} className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-border text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-2"><Eye size={18} /> Preview</button>
          </div>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto px-8 py-3 rounded-xl bg-linear-to-r from-primary to-primary/80 text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {isSubmitting ? (<><Loader2 className="animate-spin" size={20} /> Posting...</>) : (<><Send size={20} /> Post Talent Profile</>)}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl shadow-2xl border border-border max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex justify-between items-center"><h2 className="text-xl font-bold text-foreground">Profile Preview</h2><button onClick={() => setShowPreview(false)} className="p-2 hover:bg-accent rounded-full"><X size={20} /></button></div>
            <div className="p-6 space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{formData.title || "Your Professional Headline"}</h1>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1">{statusOptions.find(s => s.value === formData.currentStatus)?.emoji} {statusOptions.find(s => s.value === formData.currentStatus)?.label}</span>
                  {formData.yearsExperience && <span className="px-3 py-1 bg-accent text-foreground rounded-full text-sm">{yearsOptions.find(y => y.value === formData.yearsExperience)?.label} experience</span>}
                </div>
              </div>
              {formData.bio && (<div><h3 className="font-bold text-foreground mb-2">About Me</h3><p className="text-muted-foreground whitespace-pre-wrap">{formData.bio}</p></div>)}
              {formData.skills.length > 0 && (<div><h3 className="font-bold text-foreground mb-2">Skills</h3><div className="flex flex-wrap gap-2">{formData.skills.map(skill => (<span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{skill}</span>))}</div></div>)}
              {formData.availability.length > 0 && (<div><h3 className="font-bold text-foreground mb-2">Availability</h3><div className="flex flex-wrap gap-2">{formData.availability.map(a => (<span key={a} className="px-3 py-1 bg-accent text-foreground rounded-full text-sm">{a}</span>))}</div></div>)}
              {!formData.hideSalary && formData.expectedSalary && (<div><h3 className="font-bold text-foreground mb-2">Expected Salary</h3><p className="text-muted-foreground">{formData.expectedSalary}</p></div>)}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl shadow-2xl border border-border max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><Check size={40} className="text-green-500" /></div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Talent Profile Posted! 🎉</h2>
            <p className="text-muted-foreground mb-8">Employers can now discover you!</p>
            <div className="flex flex-col gap-3">
              {createdPostId && (<Link href={`/talent/${createdPostId}`} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors text-center">View My Profile</Link>)}
              <button onClick={() => { setShowSuccess(false); setFormData(defaultFormData); setCreatedPostId(null); }} className="w-full py-3 rounded-xl border border-border text-foreground hover:bg-accent transition-colors">Edit Profile</button>
              <Link href="/jobs" className="w-full py-3 rounded-xl border border-border text-foreground hover:bg-accent transition-colors block text-center">Browse Jobs</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
