-- ============================================================
-- ModeScout Seed Data
-- Voer dit uit NADAT je een account hebt aangemaakt in de app
-- ============================================================
DO $$
DECLARE
  v_owner_id uuid;
BEGIN
  SELECT id INTO v_owner_id FROM public.profiles LIMIT 1;

  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'Geen gebruiker gevonden. Maak eerst een account aan via /registreren en probeer opnieuw.';
  END IF;

  UPDATE public.profiles SET role = 'admin' WHERE id = v_owner_id;

  -- Merken (UUID hex-only: 00000001 t/m 00000004)
  INSERT INTO public.brands (id, owner_id, name, slug, tagline, story, status, charges_enabled, payouts_enabled, featured, legal_name, commission_rate)
  VALUES
    ('a0000000-0000-0000-0000-000000000001', v_owner_id, 'Studio Noor', 'studio-noor',
     'Minimalistische mode vanuit Amsterdam',
     'Studio Noor is opgericht door Noor van den Berg in 2021. Vanuit haar atelier in Amsterdam-Noord ontwerpt ze tijdloze basics met een eigenzinnige twist. Elk stuk is gemaakt van duurzame materialen en in kleine series geproduceerd.',
     'active', true, true, true, 'Studio Noor BV', 0.15),
    ('a0000000-0000-0000-0000-000000000002', v_owner_id, 'Roos & Co', 'roos-en-co',
     'Kleurrijke streetwear uit Rotterdam',
     'Roos & Co brengt kleur en energie naar de straat. Opgegroeid in Rotterdam, geïnspireerd door de stad. Alle prints worden door Roos zelf ontworpen.',
     'active', true, true, true, 'Roos en Co', 0.15),
    ('a0000000-0000-0000-0000-000000000003', v_owner_id, 'Label Mila', 'label-mila',
     'Duurzame avant-garde uit Utrecht',
     'Label Mila staat voor mode die nadenkt. Mila Smit combineert avant-garde silhouetten met duurzame productie in Europa.',
     'active', true, true, false, 'Label Mila', 0.15),
    ('a0000000-0000-0000-0000-000000000004', v_owner_id, 'De Draad', 'de-draad',
     'Handgemaakt knitwear, elk stuk uniek',
     'De Draad is een klein knitwear-label uit Groningen. Elk stuk wordt met de hand gebreid. Wachttijden van 2-4 weken zijn normaal — en de moeite waard.',
     'active', true, true, false, 'De Draad', 0.15)
  ON CONFLICT (id) DO NOTHING;

  -- Producten Studio Noor
  INSERT INTO public.products (id, brand_id, title, description, category, base_price_cents, status, featured)
  VALUES
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
     'Merino Wollen Trui — Crème', 'Tijdloze trui van 100% merino wol. Licht, warm en heerlijk zacht op de huid. Machine-wasbaar op 30°.', 'truien', 12900, 'published', true),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001',
     'Wide Leg Broek — Zwart', 'Elegante wide-leg broek met hoge taille. Gemaakt van gerecycled polyester.', 'broeken', 9900, 'published', false)
  ON CONFLICT (id) DO NOTHING;

  -- Producten Roos & Co
  INSERT INTO public.products (id, brand_id, title, description, category, base_price_cents, status, featured)
  VALUES
    ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002',
     'Grafisch Hoodie — Oranje/Zwart', 'Oversized hoodie met exclusieve Roos-print. 350 gram fleece.', 'hoodies', 8900, 'published', true),
    ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002',
     'Cargo Broek — Groen', 'Functionele cargo broek met zes zakken. Stretch katoen.', 'broeken', 11900, 'published', false)
  ON CONFLICT (id) DO NOTHING;

  -- Producten Label Mila
  INSERT INTO public.products (id, brand_id, title, description, category, base_price_cents, status, featured)
  VALUES
    ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003',
     'Asymmetrische Blazer — Ecru', 'Avant-garde blazer met asymmetrische sluiting. GOTS-gecertificeerd linnen.', 'jassen', 21900, 'published', true)
  ON CONFLICT (id) DO NOTHING;

  -- Producten De Draad
  INSERT INTO public.products (id, brand_id, title, description, category, base_price_cents, status, featured)
  VALUES
    ('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000004',
     'Handgebreide Vest — Meerkleurig', 'Unieke vest met kleurrijke strepen. Handgebreid, 100% Alpaca wol. Levertijd 2-4 weken.', 'truien', 18900, 'published', false)
  ON CONFLICT (id) DO NOTHING;

  -- Varianten
  INSERT INTO public.product_variants (product_id, size, color, sku, stock_qty)
  VALUES
    ('c0000000-0000-0000-0000-000000000001', 'XS', 'Crème', 'SN-TRU-CRM-XS', 3),
    ('c0000000-0000-0000-0000-000000000001', 'S',  'Crème', 'SN-TRU-CRM-S',  5),
    ('c0000000-0000-0000-0000-000000000001', 'M',  'Crème', 'SN-TRU-CRM-M',  7),
    ('c0000000-0000-0000-0000-000000000001', 'L',  'Crème', 'SN-TRU-CRM-L',  4),
    ('c0000000-0000-0000-0000-000000000002', 'S',  'Zwart', 'SN-BRK-ZWT-S',  4),
    ('c0000000-0000-0000-0000-000000000002', 'M',  'Zwart', 'SN-BRK-ZWT-M',  6),
    ('c0000000-0000-0000-0000-000000000002', 'L',  'Zwart', 'SN-BRK-ZWT-L',  3),
    ('c0000000-0000-0000-0000-000000000003', 'S',  'Oranje/Zwart', 'RC-HOD-ORN-S',  8),
    ('c0000000-0000-0000-0000-000000000003', 'M',  'Oranje/Zwart', 'RC-HOD-ORN-M',  10),
    ('c0000000-0000-0000-0000-000000000003', 'L',  'Oranje/Zwart', 'RC-HOD-ORN-L',  6),
    ('c0000000-0000-0000-0000-000000000003', 'XL', 'Oranje/Zwart', 'RC-HOD-ORN-XL', 4),
    ('c0000000-0000-0000-0000-000000000004', 'S',  'Groen', 'RC-CAR-GRN-S', 5),
    ('c0000000-0000-0000-0000-000000000004', 'M',  'Groen', 'RC-CAR-GRN-M', 7),
    ('c0000000-0000-0000-0000-000000000004', 'L',  'Groen', 'RC-CAR-GRN-L', 4),
    ('c0000000-0000-0000-0000-000000000005', 'S',  'Ecru', 'LM-BLZ-ECR-S', 2),
    ('c0000000-0000-0000-0000-000000000005', 'M',  'Ecru', 'LM-BLZ-ECR-M', 3),
    ('c0000000-0000-0000-0000-000000000005', 'L',  'Ecru', 'LM-BLZ-ECR-L', 2),
    ('c0000000-0000-0000-0000-000000000006', 'ONE SIZE', 'Meerkleurig', 'DD-VES-MLT-OS', 4);

  -- Featured items
  INSERT INTO public.featured_items (type, ref_id, position, active)
  VALUES
    ('brand',   'a0000000-0000-0000-0000-000000000001', 1, true),
    ('brand',   'a0000000-0000-0000-0000-000000000002', 2, true),
    ('product', 'c0000000-0000-0000-0000-000000000001', 1, true),
    ('product', 'c0000000-0000-0000-0000-000000000003', 2, true),
    ('product', 'c0000000-0000-0000-0000-000000000005', 3, true)
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Seed geslaagd! % is nu admin, 4 merken en 6 producten aangemaakt.', v_owner_id;
END $$;
