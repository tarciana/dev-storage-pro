/**
 * TESTES DE API - DEV STORAGE PRO
 * Local sugerido: tests/api_dev_storage.spec.js
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('API Dev Storage - Validação de Dados', () => {

  // TESTE 1: Verificar se a lista de usuários está acessível
  test('Deve retornar a lista de desenvolvedores com sucesso (GET)', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/users`);
    
    // Validar status 200 (Sucesso)
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const users = await response.json();
    
    // Validar se recebemos um array com 10 usuários (padrão da API)
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(10);
    
    // Validar se o primeiro usuário tem a propriedade 'name'
    expect(users[0]).toHaveProperty('name');
  });

  // TESTE 2: Simular a criação de um novo desenvolvedor (POST)
  test('Deve simular o cadastro de um novo desenvolvedor', async ({ request }) => {
    const novoDev = {
      name: 'Tarciana Katter',
      email: 'tarciana@dev.com',
      company: { name: 'Dev Pro Academy' }
    };

    const response = await request.post(`${BASE_URL}/users`, {
      data: novoDev
    });

    // O status 201 significa "Created"
    expect(response.status()).toBe(201);
    
    const resBody = await response.json();
    expect(resBody.name).toBe('Tarciana Katter');
  });

  // TESTE 3: Erro ao buscar usuário inexistente
  test('Deve retornar 404 ao buscar usuário que não existe', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/users/999`);
    expect(response.status()).toBe(404);
  });

});