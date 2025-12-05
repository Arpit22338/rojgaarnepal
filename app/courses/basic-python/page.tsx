"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Code, CheckCircle, Award, HelpCircle, Download, ChevronDown, ChevronRight, PlayCircle, Menu, X, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import html2canvas from "html2canvas";
import { PaymentModal } from "@/components/PaymentModal";
import PythonPlayground from "@/components/PythonPlayground";
import { COURSE_MODULES, FINAL_EXAM_DATA } from "./data";
import ReactMarkdown from "react-markdown";

export default function PythonCoursePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"lessons" | "exam" | "certificate">("lessons");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [examPassed, setExamPassed] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<"NONE" | "PENDING" | "APPROVED">("NONE");
  const [loading, setLoading] = useState(true);
  
  // Lesson State
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeLessonId, setActiveLessonId] = useState<string>("l1-1");
  const [lessonQuizAnswers, setLessonQuizAnswers] = useState<Record<string, number>>({});
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Exam State
  const [answers, setAnswers] = useState<number[]>(new Array(FINAL_EXAM_DATA.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Certificate State
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string>("");
  const [signBase64, setSignBase64] = useState<string>("");

  useEffect(() => {
    if (session) {
      fetch("/api/courses/check-enrollment?title=Basic Python Programming")
        .then(res => res.json())
        .then(data => {
          setEnrollmentStatus(data.status || "NONE");
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  // Load images for certificate
  useEffect(() => {
    const getBase64FromUrl = async (url: string) => {
      try {
        const data = await fetch(url);
        if (!data.ok) throw new Error(`Failed to fetch ${url}`);
        const blob = await data.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
          };
        });
      } catch (e) {
        console.error("Error loading image:", url, e);
        return "";
      }
    };

    getBase64FromUrl('/logo.png').then((base64) => setLogoBase64(base64 as string));
    getBase64FromUrl('/uploads/ceo-sign.png').then((base64) => setSignBase64(base64 as string));
  }, []);

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const handleQuizSubmit = (answers: number[]) => {
    let score = 0;
    answers.forEach((ans, idx) => {
      if (ans === FINAL_EXAM_DATA[idx].answer) score++;
    });
    setQuizScore(score);
    if (score >= FINAL_EXAM_DATA.length * 0.7) { // 70% passing score
      setExamPassed(true);
    }
  };

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'Rojgaar_Python_Basic_Certificate.png';
      link.click();
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Failed to generate certificate.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Render Components ---

  const renderLessons = () => {
    const activeLesson = COURSE_MODULES
      .flatMap(m => m.lessons)
      .find(l => l.id === activeLessonId);

    const activeModule = COURSE_MODULES.find(m => m.lessons.some(l => l.id === activeLessonId));

    if (!activeLesson) return null;

    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Top Navigation Bar (Sticky) */}
        <div className="sticky top-0 z-30 bg-white border-b shadow-sm px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-700 hidden sm:block">
                <Code size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Current Lesson</span>
                <h2 className="text-sm md:text-base font-bold text-gray-900 truncate max-w-[200px] md:max-w-md">
                  {activeLesson.title}
                </h2>
              </div>
            </div>

            {/* Lesson Selector Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Menu size={16} />
                <span className="hidden sm:inline">Curriculum</span>
                <ChevronDown size={16} className={`transition-transform ${isNavOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isNavOpen && (
                <>
                  <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setIsNavOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 md:w-96 max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-2">
                    <div className="flex justify-between items-center p-3 border-b mb-2">
                      <h3 className="font-bold text-gray-900">Course Curriculum</h3>
                      <button onClick={() => setIsNavOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={18} />
                      </button>
                    </div>
                    {COURSE_MODULES.map((module) => (
                      <div key={module.id} className="mb-2">
                        <div className="px-3 py-2 bg-gray-50 rounded-lg mb-1">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{module.title}</h4>
                        </div>
                        <div className="space-y-1 pl-2">
                          {module.lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => {
                                setActiveLessonId(lesson.id);
                                setIsNavOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 transition-all ${
                                activeLessonId === lesson.id 
                                  ? "bg-blue-50 text-blue-700 font-medium" 
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              {lessonQuizAnswers[lesson.id] === lesson.quiz.answer ? (
                                <CheckCircle size={14} className="text-green-500 shrink-0" />
                              ) : (
                                <div className={`w-2 h-2 rounded-full shrink-0 ${activeLessonId === lesson.id ? 'bg-blue-500' : 'bg-gray-300'}`} />
                              )}
                              <span className="truncate">{lesson.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Content & Quiz (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Lesson Content Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-4">
                    <span className="bg-blue-50 px-2 py-1 rounded text-xs uppercase tracking-wider">
                      {activeModule?.title.split(':')[0]}
                    </span>
                    <ChevronRight size={14} className="text-gray-400" />
                    <span>Reading</span>
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                    {activeLesson.title}
                  </h1>
                  
                  <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-50">
                    <ReactMarkdown>{activeLesson.content}</ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Quiz Card */}
              {activeLesson.quiz && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100 flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm text-blue-600">
                      <HelpCircle size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900">Knowledge Check</h3>
                      <p className="text-xs text-blue-600/80">Test your understanding</p>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8">
                    <p className="text-lg font-medium text-gray-800 mb-6">{activeLesson.quiz.question}</p>
                    <div className="space-y-3">
                      {activeLesson.quiz.options.map((opt, idx) => {
                        const isSelected = lessonQuizAnswers[activeLesson.id] === idx;
                        const isCorrect = idx === activeLesson.quiz.answer;
                        
                        let buttonStyle = "bg-white hover:bg-gray-50 border-gray-200 text-gray-700";
                        if (isSelected) {
                          buttonStyle = isCorrect 
                            ? "bg-green-50 border-green-200 text-green-800 ring-1 ring-green-200" 
                            : "bg-red-50 border-red-200 text-red-800 ring-1 ring-red-200";
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => setLessonQuizAnswers(prev => ({ ...prev, [activeLesson.id]: idx }))}
                            className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 flex justify-between items-center group ${buttonStyle}`}
                          >
                            <span className="font-medium">{opt}</span>
                            {isSelected && (
                              <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                {isCorrect ? "Correct" : "Incorrect"}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Playground (lg:col-span-5) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              {activeLesson.challenge ? (
                <div className="h-[600px] lg:h-[calc(100vh-120px)] flex flex-col">
                  <PythonPlayground 
                    initialCode={activeLesson.challenge.initialCode}
                    expectedOutput={activeLesson.challenge.expectedOutput}
                    challengeTitle="Interactive Challenge"
                    challengeDescription={activeLesson.challenge.description}
                    onSuccess={() => {
                      // Optional: Mark lesson as complete or show confetti
                    }}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 p-8 text-center flex flex-col items-center justify-center h-64">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Code size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No Coding Challenge</h3>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto">
                    This lesson focuses on concepts. Read the material and take the quiz to proceed.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    const currentQuestion = FINAL_EXAM_DATA[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === FINAL_EXAM_DATA.length - 1;

    const handleAnswerSelect = (optionIndex: number) => {
      if (submitted) return;
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = optionIndex;
      setAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
      const selectedAnswer = answers[currentQuestionIndex];
      
      if (selectedAnswer === -1) {
        alert("Please select an answer.");
        return;
      }

      if (selectedAnswer === currentQuestion.answer) {
        // Correct
        if (isLastQuestion) {
          setSubmitted(true);
          setExamPassed(true);
          setQuizScore(FINAL_EXAM_DATA.length); // Perfect score if they made it here

          // Call API to mark completion
          fetch("/api/courses/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseId: "basic-python" }),
          }).catch(err => console.error("Failed to mark completion", err));
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
        }
      } else {
        // Wrong
        alert("Incorrect answer. Redirecting to the relevant lesson for review.");
        
        // Find module for the lesson
        const lessonId = currentQuestion.relatedLessonId;
        if (lessonId) {
          // setExpandedModule(targetModule.id); // No longer needed with new nav
          setActiveLessonId(lessonId);
          setActiveTab("lessons");
          
          // Reset this question so they can try again later
          const newAnswers = [...answers];
          newAnswers[currentQuestionIndex] = -1;
          setAnswers(newAnswers);
        }
      }
    };

    if (submitted && examPassed) {
       return (
        <div className="text-center space-y-6 py-12">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <Award size={48} />
          </div>
          <h2 className="text-4xl font-bold text-green-800">Congratulations!</h2>
          <p className="text-xl text-gray-600 max-w-md mx-auto">You have passed the final exam with a perfect score.</p>
          <button 
            onClick={() => setActiveTab("certificate")}
            className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-green-700 shadow-xl transition-transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <Award size={20} />
            Claim Your Certificate
          </button>
        </div>
       );
    }

    return (
      <div className="max-w-3xl mx-auto space-y-8 py-8">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Final Exam</h2>
              <p className="text-gray-500 mt-1">Prove your skills to earn the certificate</p>
            </div>
            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm">
              Question {currentQuestionIndex + 1} / {FINAL_EXAM_DATA.length}
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-3 mb-10 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${((currentQuestionIndex + 1) / FINAL_EXAM_DATA.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="mb-10">
            <p className="font-bold text-xl md:text-2xl mb-8 text-gray-800 leading-relaxed">{currentQuestion.question}</p>
            <div className="space-y-4">
              {currentQuestion.options.map((opt, oIdx) => (
                <label 
                  key={oIdx} 
                  className={`flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all group ${
                    answers[currentQuestionIndex] === oIdx 
                      ? "bg-blue-50 border-blue-500 shadow-md" 
                      : "hover:bg-gray-50 border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                    answers[currentQuestionIndex] === oIdx ? "border-blue-600" : "border-gray-300 group-hover:border-gray-400"
                  }`}>
                    {answers[currentQuestionIndex] === oIdx && <div className="w-3 h-3 rounded-full bg-blue-600" />}
                  </div>
                  <input 
                    type="radio" 
                    name={`q-${currentQuestion.id}`} 
                    className="hidden"
                    checked={answers[currentQuestionIndex] === oIdx}
                    onChange={() => handleAnswerSelect(oIdx)}
                  />
                  <span className="text-lg text-gray-700 font-medium">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <div className="text-sm text-gray-400 italic">
              Select an option to proceed
            </div>
            <button 
              onClick={handleNextQuestion}
              disabled={answers[currentQuestionIndex] === -1}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-200 transition-all hover:translate-x-1"
            >
              {isLastQuestion ? "Finish Exam" : "Next Question"}
              {!isLastQuestion && <ArrowLeft className="rotate-180" size={20} />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCertificate = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-5xl mx-auto my-8">
      <div className="mb-10">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Course Completed!
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Congratulations! You have successfully mastered the basics of Python programming. Here is your official certificate of completion.
        </p>
      </div>

      {/* Certificate Preview */}
      <div className="flex justify-center mb-10 overflow-x-auto py-4">
        <div 
          ref={certificateRef}
          className="min-w-[800px] w-[800px] min-h-[600px] h-[600px] p-8 relative text-center flex flex-col items-center justify-center shadow-2xl bg-white"
          style={{ 
            fontFamily: 'serif',
            border: '24px double #1e3a8a',
          }}
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            {logoBase64 && <Image src={logoBase64} alt="Watermark" width={600} height={600} className="object-contain" unoptimized />}
          </div>

          <div className="relative z-10 w-full flex flex-col items-center h-full justify-between py-8">
            <div className="flex flex-col items-center">
              {logoBase64 && <Image src={logoBase64} alt="Rojgaar Logo" width={240} height={80} className="h-16 w-auto object-contain mb-4" unoptimized />}
              <div className="font-bold tracking-[0.3em] uppercase text-sm text-blue-900">RojgaarNepal Skills Academy</div>
            </div>
            
            <div className="flex flex-col items-center w-full">
              <h1 className="text-5xl font-bold mb-6 font-serif text-blue-900">Certificate of Completion</h1>
              
              <p className="text-lg mb-4 italic text-gray-600">This is to certify that</p>
              
              <div className="text-4xl font-bold mb-4 border-b-2 border-gray-300 px-12 py-2 min-w-[400px] text-gray-900 font-serif">
                {session?.user?.name || "Student Name"}
              </div>
              
              <p className="text-lg mt-4 mb-2 italic text-gray-600">
                has successfully completed the comprehensive course on
              </p>
              
              <h2 className="text-3xl font-bold text-blue-800 mt-2">Basic Python Programming</h2>
            </div>
            
            <div className="flex justify-between items-end w-full px-12 mt-8">
              <div className="text-center flex flex-col items-center">
                <div className="text-lg font-bold border-b border-gray-400 px-6 pb-1 mb-2 min-w-[140px] text-gray-800">
                  {new Date().toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Date</div>
              </div>

              <div className="flex flex-col items-center -mt-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-xl border-4 border-yellow-600 bg-yellow-500">
                    <Award size={40} />
                  </div>
              </div>
              
              <div className="text-center flex flex-col items-center relative">
                <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 z-10">
                  {signBase64 ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={signBase64} alt="Signature" style={{ height: '120px', width: 'auto', maxWidth: 'none' }} />
                  ) : (
                      <div className="text-6xl font-cursive text-blue-900 opacity-80" style={{ fontFamily: 'cursive' }}>Arpit</div>
                    )}
                </div>
                
                <div className="text-lg font-bold border-t border-gray-400 pt-2 px-8 min-w-[220px] mt-12 relative z-0 text-gray-800">
                  Arpit Kafle
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">CEO, RojgaarNepal</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={downloadCertificate}
          disabled={isGenerating}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center shadow-lg hover:shadow-blue-200 disabled:opacity-70 font-bold text-lg"
        >
          {isGenerating ? (
            <span className="flex items-center">Generating...</span>
          ) : (
            <>
              <Download size={24} className="mr-3" />
              Download Certificate (PNG)
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header for Course */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/courses" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium">
            <ArrowLeft size={18} className="mr-2" />
            <span className="hidden sm:inline">Back to Classroom</span>
          </Link>
          
          <div className="font-bold text-gray-900 truncate mx-4 hidden md:block">
            Basic Python Programming
          </div>

          {/* Payment Trigger for Demo/Testing */}
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="text-xs text-blue-600 hover:underline bg-blue-50 px-3 py-1 rounded-full"
          >
            Buy Course (Rs. 299)
          </button>
        </div>
      </div>

      {/* Hero / Enrollment Gate */}
      {enrollmentStatus !== "APPROVED" && (
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-slate-900 text-white p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/chalkboard.png')]"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center p-4 bg-yellow-500 rounded-2xl mb-6 shadow-lg shadow-yellow-500/20">
                  <Code size={40} className="text-slate-900" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif tracking-tight">Basic Python Programming</h1>
                <p className="text-xl md:text-2xl text-yellow-200 max-w-2xl mx-auto font-light mb-10 leading-relaxed">
                  Master the fundamentals of Python with interactive lessons and real-time coding challenges.
                </p>
                
                {!loading && (
                  <div className="flex justify-center">
                    {enrollmentStatus === "PENDING" ? (
                      <button disabled className="bg-gray-700 text-gray-300 px-10 py-4 rounded-full font-bold text-lg flex items-center gap-3 cursor-not-allowed">
                        <Clock size={24} /> Enrollment Pending
                      </button>
                    ) : (
                      <button 
                        onClick={() => setShowPaymentModal(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-full font-bold text-lg flex items-center gap-3 shadow-xl shadow-blue-900/20 transition-all hover:scale-105 hover:-translate-y-1"
                      >
                        Enroll Now - Rs. 299
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-12 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Interactive Lessons</h3>
                  <p className="text-sm text-gray-500">Learn by doing with our structured curriculum.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Code size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">In-Browser Coding</h3>
                  <p className="text-sm text-gray-500">Write and run Python code directly in your browser.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Certified Skills</h3>
                  <p className="text-sm text-gray-500">Earn a verified certificate upon completion.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Course View (Approved) */}
      {enrollmentStatus === "APPROVED" && (
        <>
          {/* Tab Navigation */}
          <div className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto flex">
              <button 
                onClick={() => setActiveTab("lessons")}
                className={`flex-1 md:flex-none md:w-48 py-4 text-center font-medium text-sm transition-all relative ${
                  activeTab === "lessons" ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <BookOpen size={18} />
                  <span>Classroom</span>
                </div>
                {activeTab === "lessons" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
              </button>
              
              <button 
                onClick={() => setActiveTab("exam")}
                className={`flex-1 md:flex-none md:w-48 py-4 text-center font-medium text-sm transition-all relative ${
                  activeTab === "exam" ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <HelpCircle size={18} />
                  <span>Final Exam</span>
                </div>
                {activeTab === "exam" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
              </button>
              
              <button 
                onClick={() => examPassed ? setActiveTab("certificate") : alert("You must pass the exam first!")}
                className={`flex-1 md:flex-none md:w-48 py-4 text-center font-medium text-sm transition-all relative ${
                  activeTab === "certificate" ? "text-blue-600" : "text-gray-400 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Award size={18} />
                  <span>Certificate</span>
                  {!examPassed && <Lock size={12} className="opacity-50" />}
                </div>
                {activeTab === "certificate" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[calc(100vh-130px)]">
            {activeTab === "lessons" && renderLessons()}
            {activeTab === "exam" && renderQuiz()}
            {activeTab === "certificate" && renderCertificate()}
          </div>
        </>
      )}

      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        planName="Basic Python Programming"
        amount={299}
        onSuccess={() => {
          setShowPaymentModal(false);
          setEnrollmentStatus("PENDING");
        }}
      />
    </div>
  );
}

// Helper component for Lock icon
function Lock({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}
