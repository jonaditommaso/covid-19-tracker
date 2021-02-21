import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import '../styles/infoBox.css';


const InfoBox = ({title, cases, total, onClick, active}) => {
    return (
        <Card onClick={onClick} className={`infoBox ${active && 'infoBox--selected'}`}> 
            <CardContent>
                <Typography className="infoBox__total" color="textSecondary" >
                    {title}
                </Typography>
                
                <h2 className="infoBox__cases">{cases}</h2>
    
                <Typography className="infoBox__total" color="textSecondary" >
                    {total} Total
                </Typography>
            </CardContent> 
        </Card>
    );
}
 
export default InfoBox;