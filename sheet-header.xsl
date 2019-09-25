<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" encoding="UTF-8" />

	<xsl:template match="/">
		<xsl:apply-templates select="*[1]" />
	</xsl:template>

	<!-- AUTO -->
	<xsl:template match="*[1]" priority="0">
		<!--<a href="index.html">-->
		<a href="">
			<h1>
				<xsl:value-of select="name(.)" />
			</h1>
		</a>
	</xsl:template>

	<!-- MANUAL override -->
	<xsl:template match="belgianjazzwiki">
		<h1>
			<a class="heading" href="belgianjazzwiki.html">Belgian Jazz Wiki</a>
			<span class="details"> (<a href="https://docs.google.com/spreadsheets/d/1GW-fs45EtO0ODb3riHRF9A4DHszCQd_r0AyvBw5veqw/edit?usp=sharing" id="linkEdit" class="link" target="_blank">bewerk...</a>)</span>
		</h1>
	</xsl:template>

	<xsl:template match="jazzmovies_belgium">
		<h1>
			<a class="heading" href="jazzmovies.html">Belgian Jazz Movies</a>
			<span class="details"> (<a href="https://docs.google.com/spreadsheets/d/1jZyRvTJaSAFY_dspknz7wQLiHmgekkAJ2FCChWUxZ0M/edit?usp=sharing" id="linkEdit" class="link" target="_blank">bewerk...</a>)</span>
		</h1>
	</xsl:template>
	
	<xsl:template match="jazzconcerts_belgium">
		<h1>
			<a class="heading" href="jazzconcerts.html">Jazz concerts in Belgium</a>
			<!--<span class="details"> (<a href="https://docs.google.com/spreadsheets/d/1jZyRvTJaSAFY_dspknz7wQLiHmgekkAJ2FCChWUxZ0M/edit?usp=sharing" id="linkEdit" class="link" target="_blank">bewerk...</a>)</span>-->
		</h1>
		<!--<h2>A History</h2>-->
	</xsl:template>

</xsl:stylesheet>
