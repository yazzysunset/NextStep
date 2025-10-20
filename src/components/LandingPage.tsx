import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { GraduationCap, Check, X } from "lucide-react";
import { Progress } from "./ui/progress";

interface LandingPageProps {
  onAuth: () => void;
}

export function LandingPage({ onAuth }: LandingPageProps) {
  const [showAuthForm, setShowAuthForm] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    verificationCode: ""
  });
  const [error, setError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Password validation
  const validatePassword = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      validSpecialChars: /^[a-zA-Z0-9!@#$%^]*$/.test(password)
    };
  };

  const passwordValidation = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordValidation).every(v => v);

  // Calculate password strength
  const getPasswordStrength = () => {
    const validCount = Object.values(passwordValidation).filter(v => v).length;
    return (validCount / 5) * 100;
  };

  const handleSendVerification = () => {
    if (!formData.email) {
      setError("Please enter your email address");
      return;
    }
    
    // Simulate sending verification code
    setVerificationSent(true);
    setError("");
    // In a real app, this would send an email with a verification code
    console.log("Verification code sent to:", formData.email);
  };

  const handleVerifyEmail = () => {
    if (!formData.verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    // Simulate verification (in real app, verify with backend)
    // For demo, accept any 6-digit code
    if (formData.verificationCode.length === 6) {
      setEmailVerified(true);
      setError("");
    } else {
      setError("Invalid verification code. Please enter the 6-digit code sent to your email.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (!isLogin) {
      if (!formData.name) {
        setError("Please enter your name");
        return;
      }
      
      if (!emailVerified) {
        setError("Please verify your email address first");
        return;
      }

      if (!isPasswordValid) {
        setError("Password does not meet the requirements");
        setPasswordTouched(true);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    // Simulate authentication
    setTimeout(() => {
      onAuth();
    }, 500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
    
    if (field === "password" && !passwordTouched) {
      setPasswordTouched(true);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmailVerified(false);
    setVerificationSent(false);
    setPasswordTouched(false);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      verificationCode: ""
    });
  };

  const handleStartJourney = () => {
    setShowAuthForm(true);
    // Smooth scroll to auth form
    setTimeout(() => {
      document.getElementById('auth-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-xl">NextStep</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl md:text-6xl mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Your Digital Companion for Smarter Student Life
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master your budget, organize your tasks, and improve your punctuality with NextStep's intelligent tracking and insights.
          </p>
        </div>

        {/* Auth Form */}
        {showAuthForm && (
          <div id="auth-form" className="max-w-md mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
            <Card className="shadow-lg border-0">
              <CardHeader className="text-center">
                <CardTitle>{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
                <CardDescription>
                  {isLogin 
                    ? "Sign in to your NextStep account" 
                    : "Join NextStep to start your journey"
                  }
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        aria-label="Full Name"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      aria-label="Email Address"
                      disabled={!isLogin && emailVerified}
                    />
                    
                    {/* Email Verification for New Users */}
                    {!isLogin && !emailVerified && (
                      <div className="space-y-2 mt-2">
                        {!verificationSent ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleSendVerification}
                            className="w-full"
                          >
                            Send Verification Code
                          </Button>
                        ) : (
                          <>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                              <p className="text-sm text-blue-800">
                                A verification code has been sent to your email. Please enter it below.
                              </p>
                            </div>
                            <Input
                              id="verificationCode"
                              type="text"
                              placeholder="Enter 6-digit code"
                              value={formData.verificationCode}
                              onChange={(e) => handleInputChange("verificationCode", e.target.value)}
                              maxLength={6}
                              aria-label="Verification Code"
                            />
                            <Button
                              type="button"
                              variant="default"
                              size="sm"
                              onClick={handleVerifyEmail}
                              className="w-full bg-primary hover:bg-primary/90"
                            >
                              Verify Email
                            </Button>
                          </>
                        )}
                      </div>
                    )}

                    {!isLogin && emailVerified && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Check className="h-4 w-4" />
                        <span>Email verified</span>
                      </div>
                    )}
                  </div>

                  {/* Password field - only show after email verification for signup */}
                  {(isLogin || emailVerified) && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          onBlur={() => setPasswordTouched(true)}
                          aria-label="Password"
                        />
                        
                        {/* Password Requirements - Only show for signup when touched and not valid */}
                        {!isLogin && passwordTouched && !isPasswordValid && formData.password && (
                          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md space-y-2">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-red-800">Password Requirements</p>
                            </div>
                            <Progress value={getPasswordStrength()} className="h-1 mb-2" />
                            <div className="space-y-1 text-xs">
                              <div className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                                {passwordValidation.minLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                <span>Min. 8 characters</span>
                              </div>
                              <div className={`flex items-center gap-2 ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-red-600'}`}>
                                {passwordValidation.hasLowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                <span>1 lowercase letter</span>
                              </div>
                              <div className={`flex items-center gap-2 ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
                                {passwordValidation.hasUppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                <span>1 uppercase letter</span>
                              </div>
                              <div className={`flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                                {passwordValidation.hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                <span>1 number</span>
                              </div>
                              <div className={`flex items-center gap-2 ${passwordValidation.validSpecialChars ? 'text-green-600' : 'text-red-600'}`}>
                                {passwordValidation.validSpecialChars ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                <span>Only allowed special characters: !@#$%^</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {!isLogin && (
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            aria-label="Confirm Password"
                          />
                        </div>
                      )}
                    </>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!isLogin && !emailVerified}
                  >
                    {isLogin ? "Sign In" : "Create Account"}
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      onClick={toggleAuthMode}
                      className="p-0 h-auto text-primary"
                    >
                      {isLogin ? "Sign up here" : "Sign in here"}
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
}