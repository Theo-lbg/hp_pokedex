import axios from 'axios'
import type { Character, House } from './types/types'

// ========== CONFIGURATION ==========

// URL de base de l'API HP (depuis les variables d'environnement)
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://hp-api.onrender.com/api'
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT ? parseInt(import.meta.env.VITE_API_TIMEOUT) : 10000

// ========== CONFIGURATION AXIOS ==========

// Créer une instance Axios avec la configuration de base
export const api = axios.create({
  baseURL: API_BASE,
  timeout: API_TIMEOUT,
})

// Gérer les erreurs de l'API
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// ========== FONCTIONS PUBLIQUES ==========

/**
 * Récupérer TOUS les personnages de l'API
 */
export async function getAllCharacters(): Promise<Character[]> {
  const response = await api.get('/characters')
  return response.data
}

/**
 * Trouver un personnage par son ID
 * (Cherche dans la liste complète car l'API n'a pas d'endpoint individuel)
 */
export async function getCharacterById(id: string): Promise<Character | null> {
  try {
    const characters = await getAllCharacters()
    return characters.find(char => char.id === id) || null
  } catch (error) {
    console.error(`Erreur lors de la récupération du personnage ${id}:`, error)
    return null
  }
}

/**
 * Récupérer les personnages d'une maison spécifique
 */
export async function getCharactersByHouse(house: string): Promise<Character[]> {
  const response = await api.get(`/characters?house=${house}`)
  return response.data
}

/**
 * Récupérer toutes les maisons
 */
export async function getHouses(): Promise<string[]> {
  const response = await api.get('/houses')
  return response.data.map((h: House) => h.name)
}
