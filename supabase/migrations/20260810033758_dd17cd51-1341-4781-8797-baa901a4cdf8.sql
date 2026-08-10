-- 1. SERVIÇOS (CORTES E VALORES)
INSERT INTO public.services (name, description, duration_minutes, price, image_url)
VALUES 
('Corte Social', 'Corte clássico feito com tesoura e máquina, acabamento impecável.', 30, 45.00, 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop'),
('Degradê Moderno', 'Corte com transição suave, do zero ao topo, estilo atual.', 45, 55.00, 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format&fit=crop'),
('Barba Terapia', 'Barba feita com toalha quente, óleos essenciais e massagem facial.', 40, 40.00, 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop'),
('Combo ON-TESTE', 'Corte completo + Barba + Lavagem com shampoo premium.', 75, 85.00, 'https://images.unsplash.com/photo-1599351431247-f10b21899721?w=800&auto=format&fit=crop'),
('Pigmentação', 'Cobertura de falhas e realce do contorno da barba e cabelo.', 30, 30.00, 'https://images.unsplash.com/photo-1592647425447-18256f8496e7?w=800&auto=format&fit=crop'),
('Sobrancelha', 'Limpeza e design de sobrancelha na navalha.', 15, 15.00, 'https://images.unsplash.com/photo-1512690196222-7c7d2f40d055?w=800&auto=format&fit=crop');

-- 2. BARBEIROS
INSERT INTO public.barbers (display_name, bio, specialties, avatar_url)
VALUES 
('Ricardo "Mestre"', 'Mais de 15 anos de experiência em cortes clássicos.', '{"Tesoura", "Social", "Navalha"}', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'),
('Bruno "Fade"', 'Especialista em degradês e técnicas modernas de freestyle.', '{"Degradê", "Freestyle", "Barba"}', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'),
('Léo Silva', 'Expert em barba terapia e visagismo facial.', '{"Barba Terapia", "Visagismo"}', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop');

-- 3. HORÁRIOS DE FUNCIONAMENTO
DO $$
DECLARE
    barber_rec RECORD;
BEGIN
    FOR barber_rec IN SELECT id FROM public.barbers LOOP
        -- Segunda a Sexta: 09:00 - 20:00
        FOR i IN 1..5 LOOP
            INSERT INTO public.working_hours (barber_id, weekday, start_time, end_time)
            VALUES (barber_rec.id, i, '09:00:00', '20:00:00');
        END LOOP;
        -- Sábado: 09:00 - 18:00
        INSERT INTO public.working_hours (barber_id, weekday, start_time, end_time)
        VALUES (barber_rec.id, 6, '09:00:00', '18:00:00');
    END LOOP;
END $$;
