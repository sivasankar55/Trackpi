// Simulate backend API for development

let mockAdmins = [
  { id: 1, name: 'Admin A', email: 'admina@example.com' },
  { id: 2, name: 'Admin B', email: 'adminb@example.com' },
  { id: 3, name: 'Admin C', email: 'adminc@example.com' }
];

export const getAllAdmins = async () => {
  // simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAdmins;
};

export const deleteAdminById = async (id) => {
  mockAdmins = mockAdmins.filter(admin => admin.id !== id);
  await new Promise(resolve => setTimeout(resolve, 300));
  return { message: 'Deleted' };
};
