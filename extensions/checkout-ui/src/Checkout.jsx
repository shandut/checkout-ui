import React, { useEffect, useState } from "react";
import {
  Banner,
  Text,
  Tag,
  Spinner,
  useApi,
  useTranslate,
  useTarget,
  useStorage,
  reactExtension,
} from '@shopify/ui-extensions-react/checkout';
import { Divider } from "@shopify/ui-extensions/checkout";

export default reactExtension(
  'purchase.checkout.cart-line-item.render-after',
  () => <Extension />,
);

function Extension() {
  const translate = useTranslate();
  const { query, extension } = useApi();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

//Sample output
// "Pre-Order: Estimated to ship out by 9th October or earlier";

//Retrieve checkout context and merchandise data
const {
  merchandise, 
  
} = useTarget();

//console.log(merchandise.selectedOptions)

const msg = translate(
  'welcome',
  {target: merchandise.id}
  );

//Retrieve variant metafield from querying the Storefront API. 
useEffect(() => {
  fetchVariantMetafieldsFromSFAPI();
}, []);


//show errors if it breaks
useEffect(() => {
  if (showError) {
    const timer = setTimeout(() => setShowError(false), 3000);
    return () => clearTimeout(timer);
  }
}, [showError]);


useStorage().write("test","1000");


//Use Storefront API to return the metafields on the variant in the cart line item. 
async function fetchVariantMetafieldsFromSFAPI() {
  setLoading(true);
  try {
    const { data } = await query(
      `query ($id: ID!, $selectedOptions: [SelectedOptionInput!]!) {
        product(id: $id) {
          variantBySelectedOptions(selectedOptions: $selectedOptions) {
           preorder_date: metafield(namespace:"custom", key: "preorder_date")
            {
              value
            }
         }
        }
      }`,{
        variables: {
          id: merchandise.product.id,
          selectedOptions: merchandise.selectedOptions,
        },
      },
    );

// Check if productVariant and metafield exist in the data
    if (data) {
      setProducts(data);
     // console.log(data);
    } else {
      return 
      //console.log('Product variant or metafield not found');
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}
//Loading Icons if needed?
if (loading) {
  return <Spinner></Spinner>;
}

if (!loading && products.length === 0) {
  //return null;
  console.log("Not a preorder product")
  return <> </>;
}
/* If - Full Date is required.
const myDate = new Date(products.product.variantBySelectedOptions.preorder_date.value);
*/

//Formatted - Day and Month only
const preorderDate = new Date(products.product.variantBySelectedOptions.preorder_date.value).toLocaleDateString('en-GB', {  
  day:   'numeric',
  month: 'long',
  
});
//console.log(myDate);
console.log(preorderDate);

  return (
    <>
    <Text size="base" appearance="critical" >Pre-Order: Estimated to ship out by <Text size="base" emphasis="bold">{preorderDate}</Text> or earlier</Text>
    <Divider/>
    </>
  );
}


/*
  <Tag icon="delivery">Estimated Date: {products.product.variantBySelectedOptions.preorder_date.value }</Tag>
  */

function ErrorBanner() {
  return (
    <Banner status='critical'>
      There was an issue adding this product. Please try again.
    </Banner>
  );
}

/*   <Banner title="checkout-ui">
      {translate('Pre-Order: Estimated to ship out by 9th October or earlier ', {target: extension.target})}
    </Banner>
    */