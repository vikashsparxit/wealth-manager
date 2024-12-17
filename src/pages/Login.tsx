import { AuthButton } from "@/components/auth/AuthButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/Wealth-Manager-Logo.png" 
              alt="Wealth Manager" 
              className="h-12"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[#403E43]">Welcome Back</CardTitle>
          <CardDescription>Sign in to manage your family's wealth</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <AuthButton />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;