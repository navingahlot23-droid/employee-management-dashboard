export type Employee = {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    username: string;
    image: string;
    status: "Active" | "Inactive";
    isLocal?: boolean;
  
    company: {
      department: string;
      title: string;
      name: string;
    };
  
    address: {
      address: string;
      city: string;
      state: string;
      country: string;
    };
  };