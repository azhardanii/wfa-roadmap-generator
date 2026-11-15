import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  Download,
  Sparkles,
  Check,
  Compass,
  Copy,
  Flag,
  Trophy,
  Play,
  GitBranch,
  Activity,
  LayoutGrid,
  ZoomIn,
  Eye,
  Clock,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  CornerDownLeft,
  CornerDownRight,
  Palette,
  FileText
} from 'lucide-react';
import {
  downloadRoadmapImage,
  downloadRoadmapPDF,
  copyRoadmapImageToClipboard
} from '../services/exportImage';

const POSTER_THEMES = {
  emerald: {
    id: 'emerald',
    name: 'Hutan Zamrud',
    swatch: 'from-[#071B14] to-[#34D399]',
    isDark: true,
    bgHex: '#071B14',
    canvasGradient: 'linear-gradient(135deg, #071B14 0%, #0F3528 52%, #092119 100%)',
    dotColor: 'rgba(110, 231, 183, 0.14)',
    cardBgHex: '#103326',
    cardBorderHex: 'rgba(52, 211, 153, 0.28)',
    cardDoneBgHex: '#144432',
    cardDoneBorderHex: 'rgba(110, 231, 183, 0.65)',
    textPrimaryHex: '#FFFFFF',
    textSecondaryHex: 'rgba(209, 250, 229, 0.85)',
    textMutedHex: 'rgba(167, 243, 208, 0.68)',
    accentHex: '#34D399',
    accentTextHex: '#052217',
    softPillBgHex: 'rgba(255, 255, 255, 0.10)',
    softPillTextHex: '#A7F3D0',
    donePillBgHex: '#34D399',
    donePillTextHex: '#052217',
    progressPillBgHex: 'rgba(255, 255, 255, 0.12)',
    progressPillTextHex: '#D1FAE5',
    dividerHex: 'rgba(110, 231, 183, 0.20)',
    trackLineHex: 'rgba(52, 211, 153, 0.35)',
    finishBgGradient: 'linear-gradient(135deg, #103F2F 0%, #165941 100%)',
    finishBorderHex: 'rgba(110, 231, 183, 0.55)',
    finishTextHex: '#FFFFFF',
    finishSubTextHex: 'rgba(209, 250, 229, 0.80)',
    finishBadgeBgHex: '#34D399',
    finishBadgeTextHex: '#052217'
  },
  cream: {
    id: 'cream',
    name: 'Sage & Krim',
    swatch: 'from-[#EAF5ED] to-[#163B30]',
    isDark: false,
    bgHex: '#F2F7F3',
    canvasGradient: 'linear-gradient(135deg, #FCFDF8 0%, #ECF7EE 55%, #E4F2EA 100%)',
    dotColor: 'rgba(22, 59, 48, 0.11)',
    cardBgHex: '#FFFFFF',
    cardBorderHex: 'rgba(22, 59, 48, 0.16)',
    cardDoneBgHex: '#EAF6EE',
    cardDoneBorderHex: 'rgba(22, 59, 48, 0.50)',
    textPrimaryHex: '#0C221B',
    textSecondaryHex: '#2D4A3E',
    textMutedHex: '#557367',
    accentHex: '#163B30',
    accentTextHex: '#FFFFFF',
    softPillBgHex: '#E6F2EC',
    softPillTextHex: '#163B30',
    donePillBgHex: '#163B30',
    donePillTextHex: '#FFFFFF',
    progressPillBgHex: '#EDF4F0',
    progressPillTextHex: '#214E3F',
    dividerHex: 'rgba(22, 59, 48, 0.12)',
    trackLineHex: 'rgba(22, 59, 48, 0.22)',
    finishBgGradient: 'linear-gradient(135deg, #163B30 0%, #245C4A 100%)',
    finishBorderHex: '#163B30',
    finishTextHex: '#FFFFFF',
    finishSubTextHex: '#C8E6D8',
    finishBadgeBgHex: '#E1EFE8',
    finishBadgeTextHex: '#0C221B'
  },
  aurora: {
    id: 'aurora',
    name: 'Malam Aurora',
    swatch: 'from-[#090E1A] to-[#2DD4BF]',
    isDark: true,
    bgHex: '#090E1A',
    canvasGradient: 'linear-gradient(135deg, #090E1A 0%, #111D35 52%, #0B292F 100%)',
    dotColor: 'rgba(45, 212, 191, 0.14)',
    cardBgHex: '#13203A',
    cardBorderHex: 'rgba(45, 212, 191, 0.28)',
    cardDoneBgHex: '#11333B',
    cardDoneBorderHex: 'rgba(94, 234, 212, 0.65)',
    textPrimaryHex: '#FFFFFF',
    textSecondaryHex: '#CBD5E1',
    textMutedHex: 'rgba(153, 246, 228, 0.72)',
    accentHex: '#2DD4BF',
    accentTextHex: '#061A20',
    softPillBgHex: 'rgba(255, 255, 255, 0.10)',
    softPillTextHex: '#99F6E4',
    donePillBgHex: '#2DD4BF',
    donePillTextHex: '#061A20',
    progressPillBgHex: 'rgba(255, 255, 255, 0.12)',
    progressPillTextHex: '#CCFBF1',
    dividerHex: 'rgba(45, 212, 191, 0.20)',
    trackLineHex: 'rgba(45, 212, 191, 0.35)',
    finishBgGradient: 'linear-gradient(135deg, #123642 0%, #164E5B 100%)',
    finishBorderHex: 'rgba(45, 212, 191, 0.55)',
    finishTextHex: '#FFFFFF',
    finishSubTextHex: '#99F6E4',
    finishBadgeBgHex: '#2DD4BF',
    finishBadgeTextHex: '#061A20'
  },
  sunset: {
    id: 'sunset',
    name: 'Senja Terakota',
    swatch: 'from-[#1C100B] to-[#F59E0B]',
    isDark: true,
    bgHex: '#1C100B',
    canvasGradient: 'linear-gradient(135deg, #1C100B 0%, #2F1A12 55%, #24130D 100%)',
    dotColor: 'rgba(245, 158, 11, 0.14)',
    cardBgHex: '#331C14',
    cardBorderHex: 'rgba(245, 158, 11, 0.28)',
    cardDoneBgHex: '#422616',
    cardDoneBorderHex: 'rgba(251, 191, 36, 0.65)',
    textPrimaryHex: '#FFFBEB',
    textSecondaryHex: 'rgba(254, 243, 199, 0.85)',
    textMutedHex: 'rgba(253, 230, 138, 0.68)',
    accentHex: '#F59E0B',
    accentTextHex: '#1F1006',
    softPillBgHex: 'rgba(255, 255, 255, 0.10)',
    softPillTextHex: '#FDE68A',
    donePillBgHex: '#F59E0B',
    donePillTextHex: '#1F1006',
    progressPillBgHex: 'rgba(255, 255, 255, 0.12)',
    progressPillTextHex: '#FEF3C7',
    dividerHex: 'rgba(245, 158, 11, 0.22)',
    trackLineHex: 'rgba(245, 158, 11, 0.35)',
    finishBgGradient: 'linear-gradient(135deg, #472413 0%, #6B3619 100%)',
    finishBorderHex: 'rgba(251, 191, 36, 0.55)',
    finishTextHex: '#FFFBEB',
    finishSubTextHex: '#FDE68A',
    finishBadgeBgHex: '#F59E0B',
    finishBadgeTextHex: '#1F1006'
  },
  ocean: {
    id: 'ocean',
    name: 'Samudra Biru',
    swatch: 'from-[#EFF6FF] to-[#1D4ED8]',
    isDark: false,
    bgHex: '#EFF6FF',
    canvasGradient: 'linear-gradient(135deg, #F8FBFF 0%, #EFF6FF 55%, #E0F2FE 100%)',
    dotColor: 'rgba(29, 78, 216, 0.12)',
    cardBgHex: '#FFFFFF',
    cardBorderHex: 'rgba(29, 78, 216, 0.18)',
    cardDoneBgHex: '#E0F2FE',
    cardDoneBorderHex: 'rgba(29, 78, 216, 0.55)',
    textPrimaryHex: '#0F172A',
    textSecondaryHex: '#1E3A5F',
    textMutedHex: '#475569',
    accentHex: '#1D4ED8',
    accentTextHex: '#FFFFFF',
    softPillBgHex: '#DBEAFE',
    softPillTextHex: '#1E40AF',
    donePillBgHex: '#1D4ED8',
    donePillTextHex: '#FFFFFF',
    progressPillBgHex: '#EFF6FF',
    progressPillTextHex: '#1E3A8A',
    dividerHex: 'rgba(29, 78, 216, 0.14)',
    trackLineHex: 'rgba(29, 78, 216, 0.24)',
    finishBgGradient: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)',
    finishBorderHex: '#1E3A8A',
    finishTextHex: '#FFFFFF',
    finishSubTextHex: '#DBEAFE',
    finishBadgeBgHex: '#FFFFFF',
    finishBadgeTextHex: '#1E3A8A'
  },
  sakura: {
    id: 'sakura',
    name: 'Sakura Lembut',
    swatch: 'from-[#FFF1F2] to-[#BE123C]',
    isDark: false,
    bgHex: '#FFF5F7',
    canvasGradient: 'linear-gradient(135deg, #FFF9FA 0%, #FFF1F2 55%, #FCE7F3 100%)',
    dotColor: 'rgba(190, 18, 60, 0.11)',
    cardBgHex: '#FFFFFF',
    cardBorderHex: 'rgba(190, 18, 60, 0.18)',
    cardDoneBgHex: '#FFE4E6',
    cardDoneBorderHex: 'rgba(190, 18, 60, 0.55)',
    textPrimaryHex: '#3B0A18',
    textSecondaryHex: '#6B1D34',
    textMutedHex: '#8F3E56',
    accentHex: '#BE123C',
    accentTextHex: '#FFFFFF',
    softPillBgHex: '#FFE4E6',
    softPillTextHex: '#9F1239',
    donePillBgHex: '#BE123C',
    donePillTextHex: '#FFFFFF',
    progressPillBgHex: '#FFF1F2',
    progressPillTextHex: '#881337',
    dividerHex: 'rgba(190, 18, 60, 0.14)',
    trackLineHex: 'rgba(190, 18, 60, 0.24)',
    finishBgGradient: 'linear-gradient(135deg, #881337 0%, #BE123C 100%)',
    finishBorderHex: '#881337',
    finishTextHex: '#FFFFFF',
    finishSubTextHex: '#FFE4E6',
    finishBadgeBgHex: '#FFFFFF',
    finishBadgeTextHex: '#881337'
  },
  royal: {
    id: 'royal',
    name: 'Ungu Lembayung',
    swatch: 'from-[#130D26] to-[#C4B5FD]',
    isDark: true,
    bgHex: '#130D26',
    canvasGradient: 'linear-gradient(135deg, #130D26 0%, #211542 55%, #191033 100%)',
    dotColor: 'rgba(196, 181, 253, 0.15)',
    cardBgHex: '#241846',
    cardBorderHex: 'rgba(196, 181, 253, 0.26)',
    cardDoneBgHex: '#31215E',
    cardDoneBorderHex: 'rgba(196, 181, 253, 0.65)',
    textPrimaryHex: '#FFFFFF',
    textSecondaryHex: 'rgba(237, 233, 254, 0.85)',
    textMutedHex: 'rgba(221, 214, 254, 0.70)',
    accentHex: '#C4B5FD',
    accentTextHex: '#1E113A',
    softPillBgHex: 'rgba(255, 255, 255, 0.10)',
    softPillTextHex: '#DDD6FE',
    donePillBgHex: '#C4B5FD',
    donePillTextHex: '#1E113A',
    progressPillBgHex: 'rgba(255, 255, 255, 0.12)',
    progressPillTextHex: '#EDE9FE',
    dividerHex: 'rgba(196, 181, 253, 0.20)',
    trackLineHex: 'rgba(196, 181, 253, 0.35)',
    finishBgGradient: 'linear-gradient(135deg, #321F61 0%, #482D87 100%)',
    finishBorderHex: 'rgba(196, 181, 253, 0.55)',
    finishTextHex: '#FFFFFF',
    finishSubTextHex: '#DDD6FE',
    finishBadgeBgHex: '#C4B5FD',
    finishBadgeTextHex: '#1E113A'
  },
  sand: {
    id: 'sand',
    name: 'Pasir Hangat',
    swatch: 'from-[#FAF5EC] to-[#B45309]',
    isDark: false,
    bgHex: '#FAF5EC',
    canvasGradient: 'linear-gradient(135deg, #FDFBF7 0%, #FAF5EC 55%, #F3E6D0 100%)',
    dotColor: 'rgba(180, 83, 9, 0.12)',
    cardBgHex: '#FFFFFF',
    cardBorderHex: 'rgba(180, 83, 9, 0.20)',
    cardDoneBgHex: '#FEF3C7',
    cardDoneBorderHex: 'rgba(180, 83, 9, 0.55)',
    textPrimaryHex: '#291709',
    textSecondaryHex: '#5C3A1E',
    textMutedHex: '#7D5533',
    accentHex: '#B45309',
    accentTextHex: '#FFFFFF',
    softPillBgHex: '#FEF3C7',
    softPillTextHex: '#92400E',
    donePillBgHex: '#B45309',
    donePillTextHex: '#FFFFFF',
    progressPillBgHex: '#F7EFE2',
    progressPillTextHex: '#78350F',
    dividerHex: 'rgba(180, 83, 9, 0.14)',
    trackLineHex: 'rgba(180, 83, 9, 0.25)',
    finishBgGradient: 'linear-gradient(135deg, #78350F 0%, #B45309 100%)',
    finishBorderHex: '#78350F',
    finishTextHex: '#FFFFFF',
    finishSubTextHex: '#FEF3C7',
    finishBadgeBgHex: '#FFFFFF',
    finishBadgeTextHex: '#78350F'
  },
  matcha: {
    id: 'matcha',
    name: 'Matcha Kyoto',
    swatch: 'from-[#F2F8EE] to-[#15803D]',
    isDark: false,
    bgHex: '#F2F8EE',
    canvasGradient: 'linear-gradient(135deg, #FAFDF7 0%, #F2F8EE 55%, #E2F2D9 100%)',
    dotColor: 'rgba(21, 128, 61, 0.12)',
    cardBgHex: '#FFFFFF',
    cardBorderHex: 'rgba(21, 128, 61, 0.18)',
    cardDoneBgHex: '#DCFCE7',
    cardDoneBorderHex: 'rgba(21, 128, 61, 0.55)',
    textPrimaryHex: '#122618',
    textSecondaryHex: '#2C5236',
    textMutedHex: '#517358',
    accentHex: '#15803D',
    accentTextHex: '#FFFFFF',
    softPillBgHex: '#DCFCE7',
    softPillTextHex: '#166534',
    donePillBgHex: '#15803D',
    donePillTextHex: '#FFFFFF',
    progressPillBgHex: '#EFF7EB',
    progressPillTextHex: '#14532D',
    dividerHex: 'rgba(21, 128, 61, 0.14)',
    trackLineHex: 'rgba(21, 128, 61, 0.24)',
    finishBgGradient: 'linear-gradient(135deg, #14532D 0%, #15803D 100%)',
    finishBorderHex: '#14532D',
    finishTextHex: '#FFFFFF',
    finishSubTextHex: '#DCFCE7',
    finishBadgeBgHex: '#FFFFFF',
    finishBadgeTextHex: '#14532D'
  },
  swiss: {
    id: 'swiss',
    name: 'Monokrom Klasik',
    swatch: 'from-[#FAF9F6] to-[#111827]',
    isDark: false,
    bgHex: '#FAF9F6',
    canvasGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FAF9F6 55%, #F2F1EC 100%)',
    dotColor: 'rgba(17, 24, 39, 0.12)',
    cardBgHex: '#FFFFFF',
    cardBorderHex: 'rgba(17, 24, 39, 0.22)',
    cardDoneBgHex: '#F3F4F6',
    cardDoneBorderHex: '#111827',
    textPrimaryHex: '#111827',
    textSecondaryHex: '#374151',
    textMutedHex: '#6B7280',
    accentHex: '#111827',
    accentTextHex: '#FFFFFF',
    softPillBgHex: '#F3F4F6',
    softPillTextHex: '#1F2937',
    donePillBgHex: '#111827',
    donePillTextHex: '#FFFFFF',
    progressPillBgHex: '#F3F4F6',
    progressPillTextHex: '#111827',
    dividerHex: 'rgba(17, 24, 39, 0.15)',
    trackLineHex: 'rgba(17, 24, 39, 0.25)',
    finishBgGradient: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
    finishBorderHex: '#111827',
    finishTextHex: '#FFFFFF',
    finishSubTextHex: '#E5E7EB',
    finishBadgeBgHex: '#FFFFFF',
    finishBadgeTextHex: '#111827'
  },
  nordic: {
    id: 'nordic',
    name: 'Biru Nordik',
    swatch: 'from-[#F1F5F9] to-[#0369A1]',
    isDark: false,
    bgHex: '#F1F5F9',
    canvasGradient: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 55%, #E0F2FE 100%)',
    dotColor: 'rgba(3, 105, 161, 0.12)',
    cardBgHex: '#FFFFFF',
    cardBorderHex: 'rgba(3, 105, 161, 0.18)',
    cardDoneBgHex: '#E0F2FE',
    cardDoneBorderHex: 'rgba(3, 105, 161, 0.55)',
    textPrimaryHex: '#0F172A',
    textSecondaryHex: '#334155',
    textMutedHex: '#64748B',
    accentHex: '#0369A1',
    accentTextHex: '#FFFFFF',
    softPillBgHex: '#E0F2FE',
    softPillTextHex: '#075985',
    donePillBgHex: '#0369A1',
    donePillTextHex: '#FFFFFF',
    progressPillBgHex: '#F1F5F9',
    progressPillTextHex: '#0C4A6E',
    dividerHex: 'rgba(3, 105, 161, 0.14)',
    trackLineHex: 'rgba(3, 105, 161, 0.24)',
    finishBgGradient: 'linear-gradient(135deg, #0C4A6E 0%, #0369A1 100%)',
    finishBorderHex: '#0C4A6E',
    finishTextHex: '#FFFFFF',
    finishSubTextHex: '#E0F2FE',
    finishBadgeBgHex: '#FFFFFF',
    finishBadgeTextHex: '#0C4A6E'
  },
  lavender: {
    id: 'lavender',
    name: 'Kabut Lavender',
    swatch: 'from-[#F5F3FF] to-[#6D28D9]',
    isDark: false,
    bgHex: '#F5F3FF',
    canvasGradient: 'linear-gradient(135deg, #FAF8FF 0%, #F5F3FF 55%, #EDE9FE 100%)',
    dotColor: 'rgba(109, 40, 217, 0.11)',
    cardBgHex: '#FFFFFF',
    cardBorderHex: 'rgba(109, 40, 217, 0.18)',
    cardDoneBgHex: '#EDE9FE',
    cardDoneBorderHex: 'rgba(109, 40, 217, 0.55)',
    textPrimaryHex: '#1E1B4B',
    textSecondaryHex: '#4338CA',
    textMutedHex: '#6D6898',
    accentHex: '#6D28D9',
    accentTextHex: '#FFFFFF',
    softPillBgHex: '#EDE9FE',
    softPillTextHex: '#5B21B6',
    donePillBgHex: '#6D28D9',
    donePillTextHex: '#FFFFFF',
    progressPillBgHex: '#F5F3FF',
    progressPillTextHex: '#4C1D95',
    dividerHex: 'rgba(109, 40, 217, 0.14)',
    trackLineHex: 'rgba(109, 40, 217, 0.24)',
    finishBgGradient: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)',
    finishBorderHex: '#4C1D95',
    finishTextHex: '#FFFFFF',
    finishSubTextHex: '#EDE9FE',
    finishBadgeBgHex: '#FFFFFF',
    finishBadgeTextHex: '#4C1D95'
  },
  coffee: {
    id: 'coffee',
    name: 'Kopi & Karamel',
    swatch: 'from-[#FAF6F0] to-[#5D4037]',
    isDark: false,
    bgHex: '#FAF6F0',
    canvasGradient: 'linear-gradient(135deg, #FDFBF7 0%, #FAF6F0 55%, #EFE6D8 100%)',
    dotColor: 'rgba(93, 64, 55, 0.12)',
    cardBgHex: '#FFFFFF',
    cardBorderHex: 'rgba(93, 64, 55, 0.20)',
    cardDoneBgHex: '#F5ECE0',
    cardDoneBorderHex: 'rgba(93, 64, 55, 0.55)',
    textPrimaryHex: '#2B1B17',
    textSecondaryHex: '#5D4037',
    textMutedHex: '#8D6E63',
    accentHex: '#5D4037',
    accentTextHex: '#FFFFFF',
    softPillBgHex: '#F3EAE0',
    softPillTextHex: '#4E342E',
    donePillBgHex: '#5D4037',
    donePillTextHex: '#FFFFFF',
    progressPillBgHex: '#F7F1E9',
    progressPillTextHex: '#3E2723',
    dividerHex: 'rgba(93, 64, 55, 0.14)',
    trackLineHex: 'rgba(93, 64, 55, 0.25)',
    finishBgGradient: 'linear-gradient(135deg, #3E2723 0%, #5D4037 100%)',
    finishBorderHex: '#3E2723',
    finishTextHex: '#FFFFFF',
    finishSubTextHex: '#EFEBE9',
    finishBadgeBgHex: '#FFFFFF',
    finishBadgeTextHex: '#3E2723'
  },
  cyber: {
    id: 'cyber',
    name: 'Malam Neon',
    swatch: 'from-[#090D16] to-[#38BDF8]',
    isDark: true,
    bgHex: '#090D16',
    canvasGradient: 'linear-gradient(135deg, #090D16 0%, #0F172A 55%, #082032 100%)',
    dotColor: 'rgba(56, 189, 248, 0.14)',
    cardBgHex: '#111C33',
    cardBorderHex: 'rgba(56, 189, 248, 0.28)',
    cardDoneBgHex: '#0F2A44',
    cardDoneBorderHex: 'rgba(125, 211, 252, 0.65)',
    textPrimaryHex: '#F8FAFC',
    textSecondaryHex: '#CBD5E1',
    textMutedHex: 'rgba(186, 230, 253, 0.72)',
    accentHex: '#38BDF8',
    accentTextHex: '#061524',
    softPillBgHex: 'rgba(255, 255, 255, 0.10)',
    softPillTextHex: '#BAE6FD',
    donePillBgHex: '#38BDF8',
    donePillTextHex: '#061524',
    progressPillBgHex: 'rgba(255, 255, 255, 0.12)',
    progressPillTextHex: '#E0F2FE',
    dividerHex: 'rgba(56, 189, 248, 0.20)',
    trackLineHex: 'rgba(56, 189, 248, 0.35)',
    finishBgGradient: 'linear-gradient(135deg, #0C2D4D 0%, #10416B 100%)',
    finishBorderHex: 'rgba(56, 189, 248, 0.55)',
    finishTextHex: '#FFFFFF',
    finishSubTextHex: '#BAE6FD',
    finishBadgeBgHex: '#38BDF8',
    finishBadgeTextHex: '#061524'
  },
  coral: {
    id: 'coral',
    name: 'Karang Tropis',
    swatch: 'from-[#FFF7ED] to-[#EA580C]',
    isDark: false,
    bgHex: '#FFF7ED',
    canvasGradient: 'linear-gradient(135deg, #FFFBF5 0%, #FFF7ED 55%, #FFEDD5 100%)',
    dotColor: 'rgba(234, 88, 12, 0.12)',
    cardBgHex: '#FFFFFF',
    cardBorderHex: 'rgba(234, 88, 12, 0.18)',
    cardDoneBgHex: '#FFEDD5',
    cardDoneBorderHex: 'rgba(234, 88, 12, 0.55)',
    textPrimaryHex: '#2D1206',
    textSecondaryHex: '#7C2D12',
    textMutedHex: '#9A3412',
    accentHex: '#EA580C',
    accentTextHex: '#FFFFFF',
    softPillBgHex: '#FFEDD5',
    softPillTextHex: '#C2410C',
    donePillBgHex: '#EA580C',
    donePillTextHex: '#FFFFFF',
    progressPillBgHex: '#FFF7ED',
    progressPillTextHex: '#9A3412',
    dividerHex: 'rgba(234, 88, 12, 0.14)',
    trackLineHex: 'rgba(234, 88, 12, 0.25)',
    finishBgGradient: 'linear-gradient(135deg, #9A3412 0%, #EA580C 100%)',
    finishBorderHex: '#9A3412',
    finishTextHex: '#FFFFFF',
    finishSubTextHex: '#FFEDD5',
    finishBadgeBgHex: '#FFFFFF',
    finishBadgeTextHex: '#9A3412'
  },
  olive: {
    id: 'olive',
    name: 'Zaitun Mediterania',
    swatch: 'from-[#F7F8F0] to-[#4D7C0F]',
    isDark: false,
    bgHex: '#F7F8F0',
    canvasGradient: 'linear-gradient(135deg, #FCFDF8 0%, #F7F8F0 55%, #ECF2DF 100%)',
    dotColor: 'rgba(77, 124, 15, 0.12)',
    cardBgHex: '#FFFFFF',
    cardBorderHex: 'rgba(77, 124, 15, 0.20)',
    cardDoneBgHex: '#ECFCCB',
    cardDoneBorderHex: 'rgba(77, 124, 15, 0.55)',
    textPrimaryHex: '#1A2E05',
    textSecondaryHex: '#3F6212',
    textMutedHex: '#597434',
    accentHex: '#4D7C0F',
    accentTextHex: '#FFFFFF',
    softPillBgHex: '#ECFCCB',
    softPillTextHex: '#3F6212',
    donePillBgHex: '#4D7C0F',
    donePillTextHex: '#FFFFFF',
    progressPillBgHex: '#F4F8EA',
    progressPillTextHex: '#365314',
    dividerHex: 'rgba(77, 124, 15, 0.14)',
    trackLineHex: 'rgba(77, 124, 15, 0.25)',
    finishBgGradient: 'linear-gradient(135deg, #365314 0%, #4D7C0F 100%)',
    finishBorderHex: '#365314',
    finishTextHex: '#FFFFFF',
    finishSubTextHex: '#ECFCCB',
    finishBadgeBgHex: '#FFFFFF',
    finishBadgeTextHex: '#365314'
  },
  maroon: {
    id: 'maroon',
    name: 'Merah Anggur',
    swatch: 'from-[#1F0910] to-[#FB7185]',
    isDark: true,
    bgHex: '#1F0910',
    canvasGradient: 'linear-gradient(135deg, #1F0910 0%, #36101B 55%, #290B14 100%)',
    dotColor: 'rgba(251, 113, 133, 0.14)',
    cardBgHex: '#3A111D',
    cardBorderHex: 'rgba(251, 113, 133, 0.28)',
    cardDoneBgHex: '#4D1727',
    cardDoneBorderHex: 'rgba(253, 164, 175, 0.65)',
    textPrimaryHex: '#FFF1F2',
    textSecondaryHex: 'rgba(255, 228, 230, 0.85)',
    textMutedHex: 'rgba(254, 205, 211, 0.70)',
    accentHex: '#FB7185',
    accentTextHex: '#2A0912',
    softPillBgHex: 'rgba(255, 255, 255, 0.10)',
    softPillTextHex: '#FECDD3',
    donePillBgHex: '#FB7185',
    donePillTextHex: '#2A0912',
    progressPillBgHex: 'rgba(255, 255, 255, 0.12)',
    progressPillTextHex: '#FFE4E6',
    dividerHex: 'rgba(251, 113, 133, 0.22)',
    trackLineHex: 'rgba(251, 113, 133, 0.35)',
    finishBgGradient: 'linear-gradient(135deg, #521426 0%, #731C35 100%)',
    finishBorderHex: 'rgba(251, 113, 133, 0.55)',
    finishTextHex: '#FFF1F2',
    finishSubTextHex: '#FFE4E6',
    finishBadgeBgHex: '#FB7185',
    finishBadgeTextHex: '#2A0912'
  },
  slate: {
    id: 'slate',
    name: 'Grafit Modern',
    swatch: 'from-[#111827] to-[#60A5FA]',
    isDark: true,
    bgHex: '#111827',
    canvasGradient: 'linear-gradient(135deg, #111827 0%, #1F2937 55%, #161F2E 100%)',
    dotColor: 'rgba(96, 165, 250, 0.14)',
    cardBgHex: '#1E293B',
    cardBorderHex: 'rgba(96, 165, 250, 0.26)',
    cardDoneBgHex: '#1E3A5F',
    cardDoneBorderHex: 'rgba(147, 197, 253, 0.65)',
    textPrimaryHex: '#F9FAFB',
    textSecondaryHex: '#E5E7EB',
    textMutedHex: '#9CA3AF',
    accentHex: '#60A5FA',
    accentTextHex: '#0B172A',
    softPillBgHex: 'rgba(255, 255, 255, 0.10)',
    softPillTextHex: '#BFDBFE',
    donePillBgHex: '#60A5FA',
    donePillTextHex: '#0B172A',
    progressPillBgHex: 'rgba(255, 255, 255, 0.12)',
    progressPillTextHex: '#DBEAFE',
    dividerHex: 'rgba(156, 163, 175, 0.22)',
    trackLineHex: 'rgba(96, 165, 250, 0.35)',
    finishBgGradient: 'linear-gradient(135deg, #1E3A5F 0%, #254B7A 100%)',
    finishBorderHex: 'rgba(96, 165, 250, 0.55)',
    finishTextHex: '#FFFFFF',
    finishSubTextHex: '#DBEAFE',
    finishBadgeBgHex: '#60A5FA',
    finishBadgeTextHex: '#0B172A'
  }
};

const A3_WIDTH = 2200;
const A3_MIN_HEIGHT = 1556;

const LAYOUT_OPTIONS = [
  { id: 'snake', label: 'Alur Berkelok', icon: GitBranch },
  { id: 'zigzag', label: 'Garis Tengah', icon: Activity },
  { id: 'bento', label: 'Kartu Rapi', icon: LayoutGrid }
];

export default function ExportPreviewModal({ isOpen, onClose, roadmap }) {
  const canvasContainerRef = useRef(null);
  const previewViewportRef = useRef(null);

  const [layoutStyle, setLayoutStyle] = useState('snake');
  const [themeId, setThemeId] = useState('emerald');
  const [showProgress, setShowProgress] = useState(true);
  const [showDescriptions, setShowDescriptions] = useState(true);
  const [scale, setScale] = useState(3.5);
  const [zoomMode, setZoomMode] = useState('fit'); // 'fit' | 0.45 | 0.65
  const [canvasHeight, setCanvasHeight] = useState(A3_MIN_HEIGHT);
  const [fitScale, setFitScale] = useState(0.38);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Measure actual A3 sheet height & viewport bounds so all 1-9+ steps fit with zero clipping/overlap
  useEffect(() => {
    if (!isOpen) return;

    const measureLayout = () => {
      const nextHeight = canvasContainerRef.current
        ? Math.max(A3_MIN_HEIGHT, Math.ceil(canvasContainerRef.current.scrollHeight || A3_MIN_HEIGHT))
        : A3_MIN_HEIGHT;
      setCanvasHeight(nextHeight);

      if (!previewViewportRef.current) return;
      const rect = previewViewportRef.current.getBoundingClientRect();
      const availW = Math.max(260, rect.width - 36);
      const availH = Math.max(200, rect.height - 36);
      const ratio = Math.min(availW / A3_WIDTH, availH / nextHeight, 0.56);
      setFitScale(Number(ratio.toFixed(3)));
    };

    measureLayout();
    const rafId = requestAnimationFrame(measureLayout);
    const observer = new ResizeObserver(measureLayout);
    if (previewViewportRef.current) {
      observer.observe(previewViewportRef.current);
    }
    if (canvasContainerRef.current) {
      observer.observe(canvasContainerRef.current);
    }
    window.addEventListener('resize', measureLayout);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', measureLayout);
    };
  }, [isOpen, layoutStyle, themeId, showProgress, showDescriptions, roadmap]);

  if (!isOpen || !roadmap) return null;

  const theme = POSTER_THEMES[themeId] || POSTER_THEMES.emerald;
  const steps = roadmap.steps || [];
  const stepCount = steps.length;
  const allTasks = steps.flatMap((s) => s.tasks || []);
  const doneTasks = allTasks.filter((t) => t.completed).length;
  const overallPct = allTasks.length > 0 ? Math.round((doneTasks / allTasks.length) * 100) : 0;

  const activePreviewScale = zoomMode === 'fit' ? fitScale : zoomMode;

  const handleDownload = async () => {
    if (!canvasContainerRef.current) return;
    try {
      setIsDownloading(true);
      await downloadRoadmapImage(roadmap, canvasContainerRef.current, scale, theme.bgHex);
    } catch (err) {
      console.error('Error generating roadmap image:', err);
      alert('Gagal membuat gambar: ' + (err.message || 'Error tidak diketahui'));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!canvasContainerRef.current) return;
    try {
      setIsDownloadingPdf(true);
      await downloadRoadmapPDF(roadmap, canvasContainerRef.current, scale, theme.bgHex);
    } catch (err) {
      console.error('Error generating roadmap PDF:', err);
      alert('Gagal membuat PDF: ' + (err.message || 'Error tidak diketahui'));
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleCopyImage = async () => {
    if (!canvasContainerRef.current) return;
    try {
      setIsCopying(true);
      await copyRoadmapImageToClipboard(canvasContainerRef.current, theme.bgHex);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2400);
    } catch (err) {
      console.error('Copy image error:', err);
      alert(err.message || 'Gagal menyalin gambar ke clipboard.');
    } finally {
      setIsCopying(false);
    }
  };

  // Density mode scales padding/typography automatically for 3 to 9+ steps across A3 sheet
  const cardDensity = stepCount <= 4 ? 'spacious' : stepCount <= 6 ? 'normal' : 'dense';

  // Single milestone card with 100% theme-matched tokens & crisp A3 readability
  const renderPosterCard = (step, idx, densityOverride = null) => {
    const mode = densityOverride || cardDensity;
    const tasks = step.tasks || [];
    const done = tasks.filter((t) => t.completed).length;
    const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
    const isStepDone = showProgress && tasks.length > 0 && done === tasks.length;

    const maxTasks = mode === 'spacious' ? 6 : mode === 'normal' ? 5 : 4;
    const cardPad = mode === 'spacious' ? 'p-7' : mode === 'normal' ? 'p-6' : 'p-5';
    const titleSize =
      mode === 'spacious'
        ? 'text-[25px]'
        : mode === 'normal'
        ? 'text-[22px]'
        : 'text-[20px]';
    const descSize =
      mode === 'spacious'
        ? 'text-[16.5px]'
        : mode === 'normal'
        ? 'text-[15.5px]'
        : 'text-[14.5px]';
    const taskSize =
      mode === 'spacious'
        ? 'text-[16.5px]'
        : mode === 'normal'
        ? 'text-[15.5px]'
        : 'text-[14.5px]';
    const taskSpacing = mode === 'spacious' ? 'space-y-3' : mode === 'normal' ? 'space-y-2.5' : 'space-y-2';

    return (
      <div
        className={`relative rounded-2xl border ${cardPad} flex flex-col h-full shadow-sm`}
        style={{
          backgroundColor: isStepDone ? theme.cardDoneBgHex : theme.cardBgHex,
          borderColor: isStepDone ? theme.cardDoneBorderHex : theme.cardBorderHex,
          color: theme.textPrimaryHex
        }}
      >
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2.5 mb-3.5 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className="h-8 px-3.5 rounded-full inline-flex items-center justify-center text-[15px] font-extrabold font-display leading-none"
              style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
            >
              #{String(idx + 1).padStart(2, '0')}
            </span>
            <span
              className="h-8 px-3.5 rounded-full inline-flex items-center justify-center gap-1.5 text-[14.5px] font-bold leading-none"
              style={{ backgroundColor: theme.softPillBgHex, color: theme.softPillTextHex }}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>{step.duration || '1 Minggu'}</span>
            </span>
          </div>

          {showProgress && (
            <span
              className="h-8 px-3.5 rounded-full inline-flex items-center justify-center gap-1.5 text-[14.5px] font-extrabold leading-none shrink-0"
              style={{
                backgroundColor: isStepDone ? theme.donePillBgHex : theme.progressPillBgHex,
                color: isStepDone ? theme.donePillTextHex : theme.progressPillTextHex
              }}
            >
              {isStepDone && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />}
              <span>{isStepDone ? 'Selesai' : `${pct}%`}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className={`font-display font-extrabold leading-snug mb-2 ${titleSize}`}
          style={{ color: theme.textPrimaryHex }}
        >
          {step.title}
        </h3>

        {/* Optional Description */}
        {showDescriptions && step.description && (
          <p
            className={`${descSize} font-medium leading-relaxed mb-3.5`}
            style={{ color: theme.textSecondaryHex }}
          >
            {step.description}
          </p>
        )}

        {/* Clean Task List */}
        <div
          className={`${taskSpacing} pt-3.5 mt-1 border-t`}
          style={{ borderColor: theme.dividerHex }}
        >
          {tasks.slice(0, maxTasks).map((task, tIdx) => {
            const markDone = showProgress && task.completed;
            return (
              <div
                key={task.id || tIdx}
                className={`flex items-start gap-2.5 font-medium leading-snug ${taskSize}`}
                style={{
                  color: markDone ? theme.textMutedHex : theme.textPrimaryHex,
                  textDecoration: markDone ? 'line-through' : 'none'
                }}
              >
                {markDone ? (
                  <span
                    className="w-4 h-4 rounded-full inline-flex items-center justify-center shrink-0 mt-1"
                    style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                ) : (
                  <span className="w-4 h-4 inline-flex items-center justify-center shrink-0 mt-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: theme.accentHex }}
                    />
                  </span>
                )}
                <span className="flex-1">{task.text}</span>
              </div>
            );
          })}
          {tasks.length > maxTasks && (
            <div className="text-[13.5px] font-semibold italic pt-0.5" style={{ color: theme.textMutedHex }}>
              +{tasks.length - maxTasks} langkah lainnya
            </div>
          )}
        </div>
      </div>
    );
  };

  // Finish Line Monument Card (100% theme-matched + crisp A3 typography)
  const renderFinishCard = (className = '', styleOverride = {}) => {
    const finishText = roadmap.finishLine || roadmap.title || 'Semua tahap selesai!';
    const finishLen = finishText.length;
    const finishTextClass =
      finishLen > 220
        ? 'text-[18px] leading-relaxed font-bold'
        : finishLen > 120
        ? 'text-[21px] leading-snug font-bold'
        : 'text-[25px] leading-snug font-extrabold';

    return (
      <div
        className={`rounded-2xl border p-7 flex flex-col justify-between gap-4 ${className}`}
        style={{
          backgroundImage: theme.finishBgGradient,
          borderColor: theme.finishBorderHex,
          color: theme.finishTextHex,
          ...styleOverride
        }}
      >
        <div className="flex items-center justify-between gap-2 shrink-0">
          <span
            className="h-9 px-4 rounded-full inline-flex items-center justify-center gap-2 text-[15px] font-extrabold uppercase leading-none"
            style={{ backgroundColor: theme.finishBadgeBgHex, color: theme.finishBadgeTextHex }}
          >
            <Trophy className="w-4 h-4 shrink-0" />
            <span>Finish Line</span>
          </span>
          <Flag className="w-5 h-5 opacity-75 shrink-0" />
        </div>

        <div className="my-auto">
          <div
            className="text-[14px] uppercase font-extrabold mb-2 leading-none"
            style={{ color: theme.finishSubTextHex }}
          >
            Target Akhir Tercapai
          </div>
          <div className={`font-display ${finishTextClass}`}>
            {finishText}
          </div>
        </div>

        {showProgress && (
          <div
            className="pt-3.5 border-t flex items-center justify-between text-[15px] font-bold leading-none shrink-0"
            style={{ borderColor: theme.dividerHex }}
          >
            <span>Progres Total ({stepCount} Tahap)</span>
            <span>{overallPct}% Selesai</span>
          </div>
        )}
      </div>
    );
  };

  // ==================== LAYOUT RENDERERS (A3 ADAPTIVE MULTI-ROW) ====================

  // 1. ALUR BERKELOK (MULTI-ROW S-CURVE ENGINE FOR 1 TO 9+ STEPS ON A3)
  const renderSnakePosterBody = () => {
    const allItems = [
      ...steps.map((step, idx) => ({ type: 'step', step, idx })),
      { type: 'finish' }
    ];
    const totalItems = allItems.length;
    const cols = totalItems <= 4 ? 2 : totalItems <= 9 ? 3 : 4;

    const rows = [];
    for (let i = 0; i < totalItems; i += cols) {
      rows.push({
        rowIndex: rows.length,
        items: allItems.slice(i, i + cols),
        startIdx: i
      });
    }

    const renderDirectionalBridge = (direction = 'right') => (
      <div className="w-12 shrink-0 flex items-center justify-center relative">
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full"
          style={{ backgroundColor: theme.trackLineHex }}
        />
        <div
          className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-md border-2"
          style={{
            backgroundColor: theme.accentHex,
            color: theme.accentTextHex,
            borderColor: theme.bgHex
          }}
        >
          {direction === 'right' ? (
            <ArrowRight className="w-5 h-5 stroke-[2.75]" />
          ) : (
            <ArrowLeft className="w-5 h-5 stroke-[2.75]" />
          )}
        </div>
      </div>
    );

    const renderRowTurnConnector = (rowIndex, nextFirstItem) => {
      // Even rows flow L->R so next row drops down on the RIGHT side;
      // Odd rows flow R->L so next row drops down on the LEFT side.
      const turnOnRight = rowIndex % 2 === 0;
      const nextLabel =
        nextFirstItem?.type === 'finish'
          ? 'Lanjut ke Finish Line'
          : `Lanjut ke Tahap #${String((nextFirstItem?.idx || 0) + 1).padStart(2, '0')}`;

      return (
        <div className="flex items-center gap-4 py-3">
          {!turnOnRight && (
            <div
              className="h-10 px-5 rounded-full text-[15px] font-extrabold leading-none inline-flex items-center justify-center gap-2.5 shadow-sm shrink-0 border"
              style={{
                backgroundColor: theme.accentHex,
                color: theme.accentTextHex,
                borderColor: theme.bgHex
              }}
            >
              <ArrowDown className="w-4 h-4 stroke-[2.75] shrink-0" />
              <span>{nextLabel}</span>
              <CornerDownRight className="w-4 h-4 stroke-[2.75] shrink-0" />
            </div>
          )}

          <div className="flex-1 h-0.5 rounded-full" style={{ backgroundColor: theme.trackLineHex }} />

          {turnOnRight && (
            <div
              className="h-10 px-5 rounded-full text-[15px] font-extrabold leading-none inline-flex items-center justify-center gap-2.5 shadow-sm shrink-0 border"
              style={{
                backgroundColor: theme.accentHex,
                color: theme.accentTextHex,
                borderColor: theme.bgHex
              }}
            >
              <ArrowDown className="w-4 h-4 stroke-[2.75] shrink-0" />
              <span>{nextLabel}</span>
              <CornerDownLeft className="w-4 h-4 stroke-[2.75] shrink-0" />
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="flex-1 flex flex-col justify-between gap-2 py-2">
        {rows.map((row, rIdx) => {
          const isReverseRow = rIdx % 2 === 1;
          const arrowDir = isReverseRow ? 'left' : 'right';
          const isLastRow = rIdx === rows.length - 1;
          const openSlots = cols - row.items.length;

          return (
            <React.Fragment key={rIdx}>
              <div
                className={`flex items-stretch flex-1 ${
                  isReverseRow ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {row.items.map((item, localI) => {
                  const isFinishLast = item.type === 'finish' && isLastRow && openSlots > 0;
                  return (
                    <React.Fragment key={item.type === 'finish' ? 'finish-node' : item.step.id || item.idx}>
                      <div
                        className="min-w-0 flex flex-col"
                        style={{ flex: isFinishLast ? 1 + openSlots : 1 }}
                      >
                        {item.type === 'finish'
                          ? renderFinishCard('flex-1 h-full')
                          : renderPosterCard(item.step, item.idx)}
                      </div>
                      {localI < row.items.length - 1 && renderDirectionalBridge(arrowDir)}
                    </React.Fragment>
                  );
                })}
              </div>

              {!isLastRow && renderRowTurnConnector(rIdx, rows[rIdx + 1]?.items[0])}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // 2. GARIS TENGAH (A3 TWO-BAND MILESTONE SPINE: PLENTY OF CARD WIDTH EVEN FOR 9 STEPS)
  const renderZigZagPosterBody = () => {
    const topItems = steps
      .map((step, idx) => ({ step, idx }))
      .filter((_, idx) => idx % 2 === 0);
    const bottomItems = steps
      .map((step, idx) => ({ type: 'step', step, idx }))
      .filter((_, idx) => idx % 2 === 1);
    bottomItems.push({ type: 'finish' });

    const maxColsInBand = Math.max(topItems.length, bottomItems.length);
    const bandDensity = maxColsInBand >= 5 ? 'dense' : maxColsInBand >= 4 ? 'normal' : 'spacious';

    return (
      <div className="flex-1 flex flex-col justify-between gap-4 py-2">
        {/* Top Row Band (Odd steps: #01, #03, #05, #07, #09) */}
        <div
          className="grid gap-5 items-stretch flex-1"
          style={{ gridTemplateColumns: `repeat(${Math.max(1, topItems.length)}, minmax(0, 1fr))` }}
        >
          {topItems.map(({ step, idx }) => (
            <div key={step.id || idx} className="flex flex-col">
              <div className="flex-1">{renderPosterCard(step, idx, bandDensity)}</div>
              <div className="flex flex-col items-center pt-1.5 shrink-0">
                <div className="w-0.5 h-5" style={{ backgroundColor: theme.accentHex }} />
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: theme.accentHex }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Central Full-Width Milestone Track */}
        <div className="relative h-14 flex items-center px-2 shrink-0">
          <div
            className="absolute left-6 right-6 h-2 rounded-full"
            style={{ backgroundColor: theme.trackLineHex }}
          >
            {showProgress && (
              <div
                className="h-full rounded-full"
                style={{ width: `${overallPct}%`, backgroundColor: theme.accentHex }}
              />
            )}
          </div>

          <div
            className="relative z-10 h-10 px-5 rounded-full text-[15px] font-extrabold uppercase leading-none inline-flex items-center justify-center gap-2 shadow-sm mr-4 shrink-0"
            style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
          >
            <Play className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>Mulai</span>
          </div>

          <div
            className="flex-1 grid items-center relative z-10"
            style={{ gridTemplateColumns: `repeat(${Math.max(1, stepCount)}, minmax(0, 1fr))` }}
          >
            {steps.map((step, idx) => {
              const tasks = step.tasks || [];
              const isDone = showProgress && tasks.length > 0 && tasks.every((t) => t.completed);
              return (
                <div key={step.id || idx} className="flex flex-col items-center">
                  <div
                    className="w-11 h-11 rounded-full inline-flex items-center justify-center font-display font-black text-[15px] leading-none border-2 shadow-sm"
                    style={{
                      backgroundColor: isDone ? theme.accentHex : theme.cardBgHex,
                      color: isDone ? theme.accentTextHex : theme.textPrimaryHex,
                      borderColor: theme.accentHex
                    }}
                  >
                    {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : String(idx + 1).padStart(2, '0')}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="relative z-10 h-10 px-5 rounded-full text-[15px] font-extrabold uppercase leading-none inline-flex items-center justify-center gap-2 shadow-sm ml-4 shrink-0"
            style={{ backgroundColor: theme.finishBadgeBgHex, color: theme.finishBadgeTextHex }}
          >
            <Trophy className="w-4 h-4 shrink-0" />
            <span>Finish</span>
          </div>
        </div>

        {/* Bottom Row Band (Even steps + Finish Line Card) */}
        <div
          className="grid gap-5 items-stretch flex-1"
          style={{ gridTemplateColumns: `repeat(${Math.max(1, bottomItems.length)}, minmax(0, 1fr))` }}
        >
          {bottomItems.map((item) => (
            <div key={item.type === 'finish' ? 'zigzag-finish' : item.step.id || item.idx} className="flex flex-col">
              <div className="flex flex-col items-center pb-1.5 shrink-0">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: item.type === 'finish' ? theme.finishBadgeBgHex : theme.accentHex
                  }}
                />
                <div
                  className="w-0.5 h-5"
                  style={{
                    backgroundColor: item.type === 'finish' ? theme.finishBadgeBgHex : theme.accentHex
                  }}
                />
              </div>
              <div className="flex-1">
                {item.type === 'finish'
                  ? renderFinishCard('h-full')
                  : renderPosterCard(item.step, item.idx, bandDensity)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 3. KARTU RAPI (A3 FLUSH GRID LAYOUT WITH FULL-SPAN FINISH CARD)
  const renderBentoPosterBody = () => {
    const totalItems = stepCount + 1;
    const cols = totalItems <= 4 ? 2 : totalItems <= 9 ? 3 : 4;
    const remainder = stepCount % cols;
    const finishColSpan = cols - remainder;
    const bentoDensity = cols >= 4 ? 'dense' : stepCount <= 4 ? 'spacious' : 'normal';

    return (
      <div
        className="flex-1 grid gap-5 py-2 items-stretch"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {steps.map((step, idx) => (
          <div key={step.id || idx} className="min-w-0">
            {renderPosterCard(step, idx, bentoDensity)}
          </div>
        ))}
        {renderFinishCard('min-w-0', { gridColumn: `span ${finishColSpan} / span ${finishColSpan}` })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-6xl h-[94vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200">
        {/* STUDIO MODAL HEADER */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-stone-100 flex items-center justify-between gap-2 bg-surface-50 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-pine-900 text-emerald-300 flex items-center justify-center shadow-sm shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-sm sm:text-lg font-extrabold text-pine-950 leading-tight">
                Pratinjau & Simpan Gambar Rencana
              </h2>
              <p className="text-[11px] text-stone-500 leading-snug">
                Pilih tata letak dan warna kesukaanmu sebelum menyimpan atau membagikan gambar.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200/70 text-stone-400 hover:text-stone-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STUDIO CUSTOMIZATION TOOLBAR */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-stone-100 space-y-2.5 shrink-0">
          {/* Top Bar: Layout Options + Toggles + Zoom */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1 bg-surface-100 p-1 rounded-2xl border border-stone-200/70">
              {LAYOUT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = layoutStyle === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setLayoutStyle(opt.id)}
                    className={`whitespace-nowrap flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-pine-900 text-white shadow-sm'
                        : 'text-stone-600 hover:text-pine-950 hover:bg-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setShowProgress(!showProgress)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 transition-all ${
                  showProgress
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-white text-stone-500 border-stone-200'
                }`}
              >
                <Check className="w-3 h-3 shrink-0" />
                <span>Progres</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDescriptions(!showDescriptions)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 transition-all ${
                  showDescriptions
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-white text-stone-500 border-stone-200'
                }`}
              >
                <Eye className="w-3 h-3 shrink-0" />
                <span>Deskripsi</span>
              </button>

              <div className="inline-flex items-center rounded-xl bg-surface-100 p-0.5 border border-stone-200/70 text-[11px] font-bold">
                <ZoomIn className="w-3 h-3 text-stone-400 mx-1.5 shrink-0" />
                {[
                  { id: 'fit', label: 'Pas' },
                  { id: 0.45, label: '45%' },
                  { id: 0.65, label: '65%' }
                ].map((z) => (
                  <button
                    type="button"
                    key={z.id}
                    onClick={() => setZoomMode(z.id)}
                    className={`whitespace-nowrap px-2 py-1 rounded-lg transition-all ${
                      zoomMode === z.id ? 'bg-white text-pine-950 shadow-sm' : 'text-stone-500'
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dedicated Color Theme Picker Bar (18 Curated Themes) */}
          <div className="flex items-start gap-2 pt-1.5 border-t border-stone-100">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-wider whitespace-nowrap shrink-0 mt-1.5">
              <Palette className="w-3.5 h-3.5 text-pine-700" />
              <span className="hidden sm:inline">Tema ({Object.keys(POSTER_THEMES).length}):</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar sm:flex-wrap py-0.5">
              {Object.values(POSTER_THEMES).map((t) => {
                const active = themeId === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setThemeId(t.id)}
                    className={`whitespace-nowrap shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-all btn-press ${
                      active
                        ? 'border-pine-900 bg-emerald-50 text-pine-950 ring-2 ring-emerald-400/30 font-bold shadow-sm'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:border-stone-300'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${t.swatch} border border-black/15 shrink-0`}
                    />
                    <span>{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RESPONSIVE SCALED CANVAS VIEWPORT (Exact 1:1 Parity with Exported PNG, Printable A3) */}
        <div
          ref={previewViewportRef}
          className="flex-1 overflow-auto p-4 sm:p-6 bg-stone-200/80 flex"
        >
          <div
            data-export-wrapper="true"
            className="m-auto relative shadow-2xl rounded-2xl overflow-hidden border border-stone-300/80 shrink-0 transition-all duration-200"
            style={{
              width: `${A3_WIDTH * activePreviewScale}px`,
              height: `${canvasHeight * activePreviewScale}px`,
              backgroundColor: theme.bgHex
            }}
          >
            {/* TRUE A3 LANDSCAPE EXPORTABLE CANVAS (2200x1556+ non-clipping) */}
            <div
              ref={canvasContainerRef}
              data-export-canvas="true"
              className="export-canvas-clean w-[2200px] min-h-[1556px] h-auto p-12 flex flex-col justify-between gap-6 origin-top-left font-sans select-none relative"
              style={{
                transform: `scale(${activePreviewScale})`,
                backgroundColor: theme.bgHex,
                backgroundImage: theme.canvasGradient,
                color: theme.textPrimaryHex
              }}
            >
              {/* Separate Dot Grid Overlay so canvasGradient stays 100% intact */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(${theme.dotColor} 1.5px, transparent 1.5px)`,
                  backgroundSize: '28px 28px'
                }}
              />

              {/* Poster Header */}
              <div
                className="relative z-10 flex items-start justify-between border-b pb-6 shrink-0"
                style={{ borderColor: theme.dividerHex }}
              >
                <div className="max-w-5xl pr-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="h-10 px-5 rounded-full inline-flex items-center justify-center gap-2.5 text-[15px] font-extrabold uppercase leading-none whitespace-nowrap shrink-0"
                      style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                    >
                      <Compass className="w-4 h-4 shrink-0" />
                      <span>Peta Langkah Jalur</span>
                    </span>
                    {showProgress && (
                      <span
                        className="h-10 px-5 rounded-full inline-flex items-center justify-center text-[15px] font-bold leading-none whitespace-nowrap shrink-0"
                        style={{ backgroundColor: theme.softPillBgHex, color: theme.softPillTextHex }}
                      >
                        Progres: {overallPct}% ({doneTasks}/{allTasks.length} Tugas)
                      </span>
                    )}
                  </div>
                  <h1
                    className="font-display text-[52px] font-extrabold mb-2.5 leading-[1.15]"
                    style={{ color: theme.textPrimaryHex }}
                  >
                    {roadmap.title}
                  </h1>
                  <p className="text-[18px] leading-relaxed" style={{ color: theme.textSecondaryHex }}>
                    {roadmap.summary}
                  </p>
                </div>

                {/* Brand Badge Top Right */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-2.5 justify-end mb-1.5">
                    <span
                      className="font-display text-[34px] font-black leading-none"
                      style={{ color: theme.textPrimaryHex }}
                    >
                      Jalur
                    </span>
                    <div
                      className="w-9 h-9 rounded-xl inline-flex items-center justify-center font-black"
                      style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  </div>
                  <span
                    className="text-[13px] uppercase font-bold leading-none mt-1.5 block"
                    style={{ color: theme.textMutedHex }}
                  >
                    Lembar Rencana A3
                  </span>
                </div>
              </div>

              {/* Dynamic Visualization Layout Body */}
              <div className="relative z-10 flex-1 flex flex-col min-h-0">
                {layoutStyle === 'snake' && renderSnakePosterBody()}
                {layoutStyle === 'zigzag' && renderZigZagPosterBody()}
                {layoutStyle === 'bento' && renderBentoPosterBody()}
              </div>

              {/* Clean Poster Footer (Non-overlapping with cards) */}
              <div
                className="relative z-10 flex items-center justify-between gap-8 border-t pt-4 text-[14.5px] shrink-0"
                style={{ borderColor: theme.dividerHex, color: theme.textMutedHex }}
              >
                <div className="flex items-start gap-6 min-w-0 flex-1">
                  <span className="leading-relaxed">
                    Tujuan:{' '}
                    <strong style={{ color: theme.textPrimaryHex }}>
                      {roadmap.goal || roadmap.title}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-5 shrink-0 whitespace-nowrap">
                  {roadmap.startDate && (
                    <span>
                      Mulai:{' '}
                      <strong style={{ color: theme.textPrimaryHex }}>
                        {new Date(roadmap.startDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </strong>
                    </span>
                  )}
                  <span>
                    {stepCount} Tahap • {allTasks.length} Tugas
                  </span>
                  <span className="font-semibold">Ukuran Cetak A3 • Disusun bersama Jalur</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STUDIO MODAL FOOTER */}
        <div className="px-4 sm:px-6 py-3.5 bg-surface-50 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 text-xs text-stone-600">
            <span className="font-medium whitespace-nowrap">Ukuran & Kualitas A3:</span>
            <div className="inline-flex rounded-xl bg-stone-200/70 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setScale(3)}
                className={`whitespace-nowrap px-3 py-1 rounded-lg transition-all ${
                  scale === 3 ? 'bg-white text-pine-950 shadow-soft' : 'text-stone-600 hover:text-pine-900'
                }`}
              >
                A3 HD (3x)
              </button>
              <button
                type="button"
                onClick={() => setScale(3.5)}
                className={`whitespace-nowrap px-3 py-1 rounded-lg transition-all ${
                  scale === 3.5 ? 'bg-white text-pine-950 shadow-soft' : 'text-stone-600 hover:text-pine-900'
                }`}
              >
                A3 Ultra HD
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={handleCopyImage}
              disabled={isCopying || isDownloading || isDownloadingPdf}
              className="whitespace-nowrap flex-1 sm:flex-none px-4 py-2.5 rounded-full border border-stone-200 bg-white hover:bg-emerald-50 text-pine-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all btn-press disabled:opacity-50"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Gambar Disalin!</span>
                </>
              ) : isCopying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-pine-900/30 border-t-pine-900 rounded-full animate-spin shrink-0" />
                  <span>Menyalin...</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 shrink-0" />
                  <span>Salin Gambar</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf || isDownloading || isCopying}
              className="whitespace-nowrap flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-full border border-pine-900/20 bg-emerald-50 hover:bg-emerald-100 text-pine-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-soft transition-all btn-press disabled:opacity-50"
            >
              {isDownloadingPdf ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-pine-900/30 border-t-pine-900 rounded-full animate-spin shrink-0" />
                  <span>Membuat PDF...</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span>Unduh PDF (A3)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || isDownloadingPdf || isCopying}
              className="whitespace-nowrap flex-1 sm:flex-none px-5 sm:px-6 py-2.5 rounded-full bg-pine-900 hover:bg-pine-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-card transition-all btn-press disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  <span>Menyiapkan PNG...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  <span>Unduh PNG (HD)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
