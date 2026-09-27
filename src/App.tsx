/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AppLayout } from './components/AppLayout';
import { DashboardOverview } from './components/DashboardOverview';
import { AnalyzeScreen } from './components/AnalyzeScreen';
import { MeetingInsightsScreen } from './components/MeetingInsightsScreen';
import { ActionItemsScreen } from './components/ActionItemsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { SourceModal } from './components/SourceModal';
import { ActiveView, MeetingAnalysis } from './types';
import { 
  INITIAL_MEETING, 
  CANONICAL_EXAMPLE_NOTES, 
  STUDENT_CLUB_NOTES, 
  CAPSTONE_PROJECT_NOTES 
} from './sampleData';

const SESSION_STORAGE_KEY = 'agree_mate_session_meeting';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  
  // Persist meeting and edited action items during current session
  const [currentMeeting, setCurrentMeeting] = useState<MeetingAnalysis>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read session storage:', e);
    }
    return INITIAL_MEETING;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [notesToPrefill, setNotesToPrefill] = useState('');
  const [isAddMoreMode, setIsAddMoreMode] = useState(false);

  // Sync to session storage on every update
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentMeeting));
    } catch (e) {
      console.warn('Could not write to session storage:', e);
    }
  }, [currentMeeting]);

  // Source Traceability Modal state
  const [sourceModal, setSourceModal] = useState<{
    isOpen: boolean;
    title: string;
    sourceSentence: string;
    itemType: 'decision' | 'suggestion' | 'question' | 'action';
    itemText: string;
  }>({
    isOpen: false,
    title: '',
    sourceSentence: '',
    itemType: 'decision',
    itemText: '',
  });

  const handleOpenApp = (samplePreset?: string) => {
    setNotesToPrefill(samplePreset || '');
    setIsAddMoreMode(false);
    // Directly enters the Analyze Notes page per demo flow specification
    setActiveView('analyze');
  };

  const handleAddMoreNotes = () => {
    setIsAddMoreMode(true);
    setActiveView('analyze');
  };

  const handleCancelAddMore = () => {
    setIsAddMoreMode(false);
    setActiveView('insights');
  };

  const handleStartFresh = () => {
    setIsAddMoreMode(false);
    setNotesToPrefill('');
  };

  const handleViewSource = (item: {
    text: string;
    source: string;
    type: 'decision' | 'suggestion' | 'question' | 'action';
  }) => {
    setSourceModal({
      isOpen: true,
      title: 'Source Traceability',
      sourceSentence: item.source,
      itemType: item.type,
      itemText: item.text,
    });
  };

  const handleAnalyze = async (notes: string, fileName?: string) => {
    setIsLoading(true);
    setError(null);
    setLoadingStep(1);

    // Simulate subtle step progression for UX fidelity
    const stepTimer1 = setTimeout(() => setLoadingStep(2), 600);
    const stepTimer2 = setTimeout(() => setLoadingStep(3), 1200);
    const stepTimer3 = setTimeout(() => setLoadingStep(4), 1800);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server error occurred during analysis.');
      }

      const data = await response.json();

      const newMeeting: MeetingAnalysis = {
        id: `meet-${Date.now()}`,
        title: fileName ? `${fileName.replace(/\.[^/.]+$/, '')} Analysis` : (data.title || 'Meeting Summary'),
        summary: data.summary || 'Extracted decisions and actions from meeting notes.',
        rawNotes: notes,
        createdAt: 'Just now',
        fileName: fileName,
        decisions: data.decisions || [],
        suggestions: data.suggestions || [],
        questions: data.questions || [],
        actions: data.actions || [],
      };

      setCurrentMeeting(newMeeting);
      setIsAddMoreMode(false);
      setNotesToPrefill('');
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setLoadingStep(4);
      setTimeout(() => {
        setIsLoading(false);
        setActiveView('insights');
      }, 400);
    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsLoading(false);
      setError(err.message || 'We couldn’t analyze these notes. Please try again.');
    }
  };

  const handleSelectPreset = (name: 'canonical' | 'club' | 'capstone') => {
    setIsAddMoreMode(false);
    if (name === 'canonical') {
      setCurrentMeeting(INITIAL_MEETING);
      setActiveView('insights');
    } else if (name === 'club') {
      handleAnalyze(STUDENT_CLUB_NOTES);
    } else {
      handleAnalyze(CAPSTONE_PROJECT_NOTES);
    }
  };

  // If in landing page view, render LandingPage directly
  if (activeView === 'landing') {
    return <LandingPage onOpenApp={handleOpenApp} />;
  }

  return (
    <AppLayout
      activeView={activeView}
      onNavigate={(v) => {
        if (v !== 'analyze') {
          setIsAddMoreMode(false);
        }
        setActiveView(v);
      }}
      onReturnToLanding={() => setActiveView('landing')}
      currentMeeting={currentMeeting}
    >
      {/* SCREEN 1: ANALYZE MEETING */}
      {activeView === 'analyze' && (
        <AnalyzeScreen
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          loadingStep={loadingStep}
          error={error}
          onClearError={() => setError(null)}
          initialNotes={notesToPrefill}
          existingNotes={currentMeeting?.rawNotes || ''}
          isAddMoreMode={isAddMoreMode}
          onCancelAddMore={handleCancelAddMore}
          onStartFresh={handleStartFresh}
          onEnterAddMoreMode={handleAddMoreNotes}
        />
      )}

      {/* SCREEN 2: MEETING INSIGHTS */}
      {activeView === 'insights' && (
        <MeetingInsightsScreen
          meeting={currentMeeting}
          onUpdateMeeting={setCurrentMeeting}
          onViewSource={handleViewSource}
          onGoToActions={() => setActiveView('actions')}
          onAddMoreNotes={handleAddMoreNotes}
        />
      )}

      {/* SCREEN 3: ACTION ITEMS */}
      {activeView === 'actions' && (
        <ActionItemsScreen
          meeting={currentMeeting}
          onUpdateMeeting={setCurrentMeeting}
          onViewSource={handleViewSource}
          onAddMoreNotes={handleAddMoreNotes}
        />
      )}

      {/* DASHBOARD OVERVIEW */}
      {activeView === 'dashboard' && (
        <DashboardOverview
          currentMeeting={currentMeeting}
          onNavigate={(v) => {
            setIsAddMoreMode(false);
            setActiveView(v);
          }}
          onSelectMeetingPreset={handleSelectPreset}
          onAddMoreNotes={handleAddMoreNotes}
        />
      )}

      {/* SETTINGS */}
      {activeView === 'settings' && (
        <SettingsScreen
          meeting={currentMeeting}
          onResetMeeting={(m) => setCurrentMeeting(m)}
        />
      )}

      {/* SOURCE TRACEABILITY MODAL */}
      <SourceModal
        isOpen={sourceModal.isOpen}
        onClose={() => setSourceModal((prev) => ({ ...prev, isOpen: false }))}
        title={sourceModal.title}
        sourceSentence={sourceModal.sourceSentence}
        itemType={sourceModal.itemType}
        itemText={sourceModal.itemText}
        rawNotes={currentMeeting.rawNotes}
      />
    </AppLayout>
  );
}
