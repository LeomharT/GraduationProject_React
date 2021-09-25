
import React from 'react';
import ContentLoader from 'react-content-loader';

const DetailInfoContentLoader = (props: any) =>
{
    return (
        <ContentLoader viewBox="0 0 800 400" height={400} width={800} style={{ margin: "0 auto" }} {...props}>
            <circle cx="472" cy="159" r="7" />
            <rect x="487" y="154" rx="5" ry="5" width="220" height="10" />
            <circle cx="472" cy="190" r="7" />
            <rect x="487" y="184" rx="5" ry="5" width="220" height="10" />
            <circle cx="472" cy="219" r="7" />
            <rect x="487" y="214" rx="5" ry="5" width="220" height="10" />
            <circle cx="472" cy="249" r="7" />
            <rect x="487" y="244" rx="5" ry="5" width="220" height="10" />
            <rect x="64" y="18" rx="0" ry="0" width="346" height="300" />
            <rect x="229" y="300" rx="0" ry="0" width="0" height="0" />
            <rect x="111" y="340" rx="0" ry="0" width="0" height="0" />
            <rect x="121" y="342" rx="0" ry="0" width="0" height="0" />
            <rect x="194" y="329" rx="0" ry="0" width="0" height="0" />
            <rect x="192" y="323" rx="0" ry="0" width="0" height="0" />
            <rect x="185" y="323" rx="0" ry="0" width="0" height="0" />
            <rect x="470" y="18" rx="0" ry="0" width="300" height="25" />
            <rect x="470" y="58" rx="0" ry="0" width="300" height="6" />
            <rect x="470" y="68" rx="0" ry="0" width="300" height="6" />
            <rect x="470" y="78" rx="0" ry="0" width="300" height="6" />
            <rect x="798" y="135" rx="0" ry="0" width="0" height="0" />
            <rect x="731" y="132" rx="0" ry="0" width="0" height="0" />
            <rect x="470" y="99" rx="0" ry="0" width="70" height="30" />
            <rect x="560" y="99" rx="0" ry="0" width="70" height="30" />
        </ContentLoader>
    );
};

DetailInfoContentLoader.metadata = {
    name: 'Sarah Ann Garcia',
    github: 'sgarcia30',
    description: 'This is an Amazon sample product.', // Little tagline
    filename: 'AmazonLoader',
};

const CommentLoader = (props: any) => (
    <ContentLoader
        speed={2}
        width={476}
        height={124}
        viewBox="0 0 476 124"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
        <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
        <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
        <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
        <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
        <circle cx="20" cy="20" r="20" />
    </ContentLoader>
);

export { DetailInfoContentLoader, CommentLoader };
