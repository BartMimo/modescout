-- ============================================================
-- ModeScout Seed Data — met echte Unsplash foto's
-- Voer dit uit NADAT je een account hebt aangemaakt in de app
-- ============================================================
DO $$
DECLARE
  v_owner_id uuid;
BEGIN
  SELECT id INTO v_owner_id FROM public.profiles LIMIT 1;

  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'Geen gebruiker gevonden. Maak eerst een account aan via /registreren.';
  END IF;

  UPDATE public.profiles SET role = 'admin' WHERE id = v_owner_id;

  -- Merken
  INSERT INTO public.brands (id, owner_id, name, slug, tagline, story, status, charges_enabled, payouts_enabled, featured, legal_name, commission_rate, logo_url)
  VALUES
    ('a0000000-0000-0000-0000-000000000001', v_owner_id, 'Studio Noor', 'studio-noor',
     'Minimalistische mode vanuit Amsterdam',
     'Studio Noor is opgericht door Noor van den Berg in 2021. Vanuit haar atelier in Amsterdam-Noord ontwerpt ze tijdloze basics met een eigenzinnige twist. Elk stuk is gemaakt van duurzame materialen en in kleine series geproduceerd.',
     'active', true, true, true, 'Studio Noor BV', 0.15,
     'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80'),
    ('a0000000-0000-0000-0000-000000000002', v_owner_id, 'Roos & Co', 'roos-en-co',
     'Kleurrijke streetwear uit Rotterdam',
     'Roos & Co brengt kleur en energie naar de straat. Opgegroeid in Rotterdam, geïnspireerd door de stad. Alle prints worden door Roos zelf ontworpen en de collecties worden twee keer per jaar gelanceerd.',
     'active', true, true, true, 'Roos en Co', 0.15,
     'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=80'),
    ('a0000000-0000-0000-0000-000000000003', v_owner_id, 'Label Mila', 'label-mila',
     'Duurzame avant-garde uit Utrecht',
     'Label Mila staat voor mode die nadenkt. Mila Smit combineert avant-garde silhouetten met duurzame productie in Europa. Haar stukken zijn investeringen — ontworpen om decennia mee te gaan.',
     'active', true, true, false, 'Label Mila', 0.15,
     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'),
    ('a0000000-0000-0000-0000-000000000004', v_owner_id, 'De Draad', 'de-draad',
     'Handgemaakt knitwear, elk stuk uniek',
     'De Draad is een klein knitwear-label uit Groningen. Oprichtster Lien breit elk stuk met de hand of op een kleine knitmachine. Geen twee exemplaren zijn identiek.',
     'active', true, true, false, 'De Draad', 0.15,
     'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80')
  ON CONFLICT (id) DO NOTHING;

  -- Producten Studio Noor
  INSERT INTO public.products (id, brand_id, title, description, category, base_price_cents, status, featured)
  VALUES
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
     'Merino Wollen Trui — Crème', 'Tijdloze trui van 100% merino wol. Licht, warm en heerlijk zacht op de huid. Machine-wasbaar op 30°. Valt normaal — bestel je eigen maat.', 'truien', 12900, 'published', true),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001',
     'Wide Leg Broek — Zwart', 'Elegante wide-leg broek met hoge taille. Gemaakt van gerecycled polyester. Valt wijd — bestel je normale maat.', 'broeken', 9900, 'published', false)
  ON CONFLICT (id) DO NOTHING;

  -- Producten Roos & Co
  INSERT INTO public.products (id, brand_id, title, description, category, base_price_cents, status, featured)
  VALUES
    ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002',
     'Grafisch Hoodie — Oranje/Zwart', 'Oversized hoodie met exclusieve Roos-print. 350 gram fleece. Warm, comfortabel en opvallend aanwezig.', 'hoodies', 8900, 'published', true),
    ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002',
     'Cargo Broek — Groen', 'Functionele cargo broek met zes zakken. Denim-look van stretch katoen. Perfect voor de stad.', 'broeken', 11900, 'published', false)
  ON CONFLICT (id) DO NOTHING;

  -- Producten Label Mila
  INSERT INTO public.products (id, brand_id, title, description, category, base_price_cents, status, featured)
  VALUES
    ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003',
     'Asymmetrische Blazer — Ecru', 'Avant-garde blazer met asymmetrische sluiting. GOTS-gecertificeerd linnen. Draagbaar als jasje of jurk.', 'jassen', 21900, 'published', true)
  ON CONFLICT (id) DO NOTHING;

  -- Producten De Draad
  INSERT INTO public.products (id, brand_id, title, description, category, base_price_cents, status, featured)
  VALUES
    ('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000004',
     'Handgebreide Vest — Meerkleurig', 'Unieke vest met kleurrijke strepen. Handgebreid in Groningen, 100% Alpaca wol. Levertijd 2-4 weken.', 'truien', 18900, 'published', false)
  ON CONFLICT (id) DO NOTHING;

  -- Product afbeeldingen — professionele fashion fotografie via Unsplash
  INSERT INTO public.product_images (product_id, url, position)
  VALUES
    -- Studio Noor: Merino Wollen Trui Crème
    ('c0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=85', 0),
    ('c0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=85', 1),
    -- Studio Noor: Wide Leg Broek Zwart
    ('c0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=85', 0),
    ('c0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1594938298603-c8148c4b8b79?w=800&q=85', 1),
    -- Roos & Co: Grafisch Hoodie Oranje/Zwart
    ('c0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=85', 0),
    ('c0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1525171254930-643fc658b64e?w=800&q=85', 1),
    -- Roos & Co: Cargo Broek Groen
    ('c0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=85', 0),
    ('c0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1529391409740-59f2cea08bc6?w=800&q=85', 1),
    -- Label Mila: Asymmetrische Blazer Ecru
    ('c0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=85', 0),
    ('c0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=85', 1),
    -- De Draad: Handgebreide Vest Meerkleurig
    ('c0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=85', 0),
    ('c0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&q=85', 1)
  ON CONFLICT DO NOTHING;

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
    ('brand',   'a0000000-0000-0000-0000-000000000003', 3, true),
    ('brand',   'a0000000-0000-0000-0000-000000000004', 4, true),
    ('product', 'c0000000-0000-0000-0000-000000000001', 1, true),
    ('product', 'c0000000-0000-0000-0000-000000000003', 2, true),
    ('product', 'c0000000-0000-0000-0000-000000000005', 3, true),
    ('product', 'c0000000-0000-0000-0000-000000000002', 4, true),
    ('product', 'c0000000-0000-0000-0000-000000000004', 5, true),
    ('product', 'c0000000-0000-0000-0000-000000000006', 6, true)
  ON CONFLICT DO NOTHING;

  RAISE NOTICE '✓ Seed geslaagd! % is nu admin, 4 merken, 6 producten met foto''s aangemaakt.', v_owner_id;
END $$;
