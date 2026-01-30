import type { Schema, Struct } from '@strapi/strapi';

export interface MotorsCompatibility extends Struct.ComponentSchema {
  collectionName: 'components_motors_compatibilities';
  info: {
    description: '';
    displayName: 'Compatibility';
    icon: 'cog';
  };
  attributes: {
    brand: Schema.Attribute.String;
    model: Schema.Attribute.String;
    reference: Schema.Attribute.String;
  };
}

export interface MotorsFitmentDetail extends Struct.ComponentSchema {
  collectionName: 'components_motors_fitment_details';
  info: {
    description: 'Detalle de compatibilidad espec\u00EDfica (a\u00F1os)';
    displayName: 'FitmentDetail';
    icon: 'cog';
  };
  attributes: {
    model: Schema.Attribute.String;
    years: Schema.Attribute.String;
  };
}

export interface SharedSeoMetadata extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo_metadata';
  info: {
    description: 'SEO Metadata for better search engine visibility';
    displayName: 'SeoMetadata';
    icon: 'search';
  };
  attributes: {
    canonicalUrlOverride: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface ShopProductVariant extends Struct.ComponentSchema {
  collectionName: 'components_shop_product_variants';
  info: {
    description: 'Variaciones de producto (Talla, Color, etc)';
    displayName: 'ProductVariant';
    icon: 'shirt';
  };
  attributes: {
    attribute: Schema.Attribute.String & Schema.Attribute.Required;
    price_modifier: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    stock_status: Schema.Attribute.Enumeration<['Disponible', 'Agotado']> &
      Schema.Attribute.DefaultTo<'Disponible'>;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'motors.compatibility': MotorsCompatibility;
      'motors.fitment-detail': MotorsFitmentDetail;
      'shared.seo-metadata': SharedSeoMetadata;
      'shop.product-variant': ShopProductVariant;
    }
  }
}
