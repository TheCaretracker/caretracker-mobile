import api from "@/api/api";

export const listContacts = async () => api.get('/contact')

export const showContact = async (id: number) => api.get(`/contact/${id}`)

export const createContact = async (values: ContactData) => 
  api.post('/contact', { contact: values })
  
export const updateContact = async (values: ContactData) => 
  api.put(`/contact/${values.id}`, { contact: values })

export interface ContactData {
  id?: number
  contactName?: string
  phoneNumber?: string
  phoneType?: string
  email?: string
  relationship?: string
  medicalSpeciality?: string
}
