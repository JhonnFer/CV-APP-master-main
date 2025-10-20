// context/CVContext.tsx

import React, { createContext, ReactNode, useContext, useState } from "react";
import { CVData, Education, Experience, PersonalInfo, Skill } from "../types/cv.types";

interface CVContextType {
  cvData: CVData;
  setPersonalInfo: (info: PersonalInfo) => void;
  addExpense: (exp: any) => void;
  updateExpense: (id: string, exp: any) => void;
  deleteExpense: (id: string) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Experience) => void;
  deleteExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Education) => void;
  deleteEducation: (id: string) => void;
  addSkill: (skill: Omit<Skill, "id">) => void;
  removeSkill: (id: string) => void;
  updateSkill: (skill: Skill) => void;
  resetCV: () => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      profileImage: "",
    },
    
    experiences: [],
    education: [],
    skills: [], // 🔹 Nueva propiedad para Skills
    expenses: [],
  });

  // 🔹 Información personal
  const setPersonalInfo = (info: PersonalInfo) => {
    setCvData((prev) => ({ ...prev, personalInfo: info }));
  };

  // 🔹 Experiencia
  const addExperience = (exp: Experience) => {
    setCvData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, exp],
    }));
  };

  const updateExperience = (id: string, exp: Experience) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? exp : e)),
    }));
  };

  const deleteExperience = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  };

  // 🔹 Educación
  const addEducation = (edu: Education) => {
    setCvData((prev) => ({
      ...prev,
      education: [...prev.education, edu],
    }));
  };

  const updateEducation = (id: string, edu: Education) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? edu : e)),
    }));
  };

  const deleteEducation = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  // 🔹 Habilidades (Skills)
  const addSkill = (skill: Omit<Skill, "id">) => {
    const newSkill: Skill = { ...skill, id: Date.now().toString() };
    setCvData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const removeSkill = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  const updateSkill = (updatedSkill: Skill) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === updatedSkill.id ? updatedSkill : s)),
    }));
  };

  // 🔹 Gastos (Expenses)
  const addExpense = (exp: any) => {
    const newExp = { ...exp, id: Date.now().toString() };
    setCvData((prev) => ({
      ...prev,
      expenses: [...(prev.expenses || []), newExp],
    }));
  };

  const updateExpense = (id: string, exp: any) => {
    setCvData((prev) => ({
      ...prev,
      expenses: prev.expenses ? prev.expenses.map((e) => (e.id === id ? exp : e)) : [exp],
    }));
  };

  const deleteExpense = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      expenses: prev.expenses ? prev.expenses.filter((e) => e.id !== id) : [],
    }));
  };

  // 🔹 Resetear todo el CV
  const resetCV = () => {
    setCvData({
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
        profileImage: "",
      },
      experiences: [],
      education: [],
      skills: [],
    });
  };

  return (
    <CVContext.Provider
      value={{
        cvData,
        setPersonalInfo,
        addExpense,
        updateExpense,
        deleteExpense,
        addExperience,
        updateExperience,
        deleteExperience,
        addEducation,
        updateEducation,
        deleteEducation,
        addSkill,
        removeSkill,
        updateSkill,
        resetCV,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCVContext = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error("useCVContext must be used within CVProvider");
  }
  return context;
};
