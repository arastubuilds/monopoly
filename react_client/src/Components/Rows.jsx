import React from "react";
import { Space } from "./Space";

function Row({ spaces, range }) {
    return spaces?.filter((space) => space?.id >= range[0] && space?.id <= range[1])
        .map((space) => (
            <Space
                key={space?.id}
                name={space?.name}
                color={space?.color}
                price={space?.price}
                gridRow={space?.gridRow}
                gridCol={space?.gridColumn}
                rotate = {space?.rotate}
            />
        ));
}

export function Rows({ spaces }) {
    return (
        <>
            <Row spaces={spaces} range={[0, 10]} />
            <Row spaces={spaces} range={[11, 20]} />
            <Row spaces={spaces} range={[21, 30]} />
            <Row spaces={spaces} range={[31, 39]} />
        </>
    );
}
