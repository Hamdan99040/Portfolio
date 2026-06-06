'use client';

import { useEffect, useState } from 'react';

export interface PublicProfile {
  name: string;
  title: string;
  location: string;
  bio: string;
  cvUrl: string;
  avatarUrl: string;
  profiles?: {
    github?: string;
    linkedin?: string;
    upwork?: string;
    facebook?: string;
    instagram?: string;
    email?: string;
  };
}

const fallbackProfile: PublicProfile = {
  name: 'Muhammad Hamdan',
  title: 'Full Stack Developer | SQA Engineer',
  location: 'Okara, Pakistan',
  bio: 'MERN Stack Developer and Software Quality Assurance Engineer focused on secure, scalable web applications and reliable user experiences.',
  cvUrl: '/uploads/1780222111128_cv.pdf',
  avatarUrl: '/avatar.jpg',
  profiles: {
    github: 'https://github.com/Hamdan99040',
    linkedin: 'https://www.linkedin.com/in/hamdan-yaseen-27b7b2258/',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    email: 'hamdanyaseen99040@gmail.com',
  },
};

export function useProfile() {
  const [profile, setProfile] = useState<PublicProfile>(fallbackProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) return;
        const data = await res.json();
        if (active) setProfile({ ...fallbackProfile, ...data, profiles: { ...fallbackProfile.profiles, ...data.profiles } });
      } catch (err) {
        console.error('Failed to load public profile:', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  return { profile, loading };
}
