import React, { useEffect, useState } from "react";
import {
  Banner,
  Text,
  Tag,
  Image,
  Spinner,
  useApi,
  useTranslate,
  useTarget,
  useCustomer,
  useCartLines,
  reactExtension,
} from '@shopify/ui-extensions-react/checkout';
import { Divider } from "@shopify/ui-extensions/checkout";

export default reactExtension(
  'purchase.checkout.reductions.render-after',
  () => <Extension3 />,
);

function Extension3() {
  const translate = useTranslate();
  const { query, extension } = useApi();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

//Sample output
// "Pre-Order: Estimated to ship out by 9th October or earlier";
const [cartline] = useCartLines();
const {merchandise} = cartline;
//Retrieve checkout context and merchandise data
//merchandise.forEach(line => {
  console.log(merchandise.title);
//});

//console.log(merchandise.selectedOptions)

/*
const msg = translate(
  'welcome',
  {target: merchandise.id}
  );
*/


//show errors if it breaks
useEffect(() => {
  if (showError) {
    const timer = setTimeout(() => setShowError(false), 3000);
    return () => clearTimeout(timer);
  }
}, [showError]);

//Use Storefront API to return the metafields on the variant in the cart line item. 





  return (
    <>
  <Divider>
   
   
    </Divider>
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