import { AuthButton } from "@/components/auth/AuthButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/65326e7f-54d5-421b-bba3-2213d746a3dd.png" 
              alt="Wealth Manager" 
              className="h-16 w-auto" // Increased size from h-12 to h-16
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[#374151]">Welcome Back</CardTitle>
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